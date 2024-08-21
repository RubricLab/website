import {
	OrbitControls,
	PerspectiveCamera,
	shaderMaterial
} from '@react-three/drei'
import {Canvas, extend} from '@react-three/fiber'
import {Bloom, EffectComposer, SMAA} from '@react-three/postprocessing'
import gsap from 'gsap'
import {folder, useControls} from 'leva'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import * as THREE from 'three'

const o = new THREE.Object3D()
const c = new THREE.Color()

const MeshEdgesMaterial = shaderMaterial(
	{
		color: new THREE.Color('red'),
		size: new THREE.Vector3(1, 1, 1),
		thickness: 0.01,
		smoothness: 0.2,
		bloomFactor: 0
	},
	/*glsl*/ `
  attribute float bloomFactor;

  varying vec3 vPosition;
  varying float vBloomFactor;

  void main() {
    vPosition = position;
    vBloomFactor = bloomFactor;
    gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
  }`,
	/*glsl*/ `
  varying vec3 vPosition;
  varying float vBloomFactor;
  
  uniform vec3 size;
  uniform vec3 color;
  uniform float bloomFactor;
  uniform float thickness;
  uniform float smoothness;
  void main() {
    vec3 d = abs(vPosition) - (size * 0.5);
    float a = smoothstep(thickness, thickness + smoothness, min(min(length(d.xy), length(d.yz)), length(d.xz)));
    gl_FragColor = vec4(color * (1.0 + bloomFactor + vBloomFactor), 1.0 - a);
  }`
)

extend({MeshEdgesMaterial})

const logos = [
	[
		/* grid of 1 and 0 */
		[0, 0, 0, 0, 0],
		[0, 1, 0, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 0, 1, 0],
		[0, 0, 0, 0, 0]
	],
	[
		/* grid of 1 and 0 */
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 1, 0, 1, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 1, 0, 1, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	/* generate a 3x3 grid with  */
	[
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0]
	]
]

const Scene = () => {
	const outlinesRef = useRef<THREE.InstancedMesh>(null)
	const [baseColor, setColor] = useState(() => new THREE.Color('#ffffff'))
	const [activeColor, setActiveColor] = useState(
		() => new THREE.Color('#939393')
	)
	const [borderColor, setBorderColor] = useState(() => new THREE.Color('red'))
	const ctrls = useControls('wall', {
		pattern: {
			value: 3,
			options: {
				Rubric: 3,
				'Logo 1': 0,
				'Logo 2': 1,
				'Logo 3': 2
			}
		},
		color: {
			value: '#000',
			onChange: (value: string) => {
				setColor(baseColor.clone().set(value))
			}
		},
		borderColor: {
			value: '#ffffff',
			onChange: (value: string) => {
				setBorderColor(borderColor.clone().set(value))
			}
		},
		gridfrom: {
			value: 'start',
			options: {
				center: 'center',
				edges: 'edges',
				random: 'random',
				start: 'start',
				end: 'end'
			}
		},
		activeColor: {
			value: '#000',
			onChange: (value: string) => {
				setActiveColor(activeColor.clone().set(value))
			}
		},
		activeBloomFactor: {
			value: 0,
			min: 0,
			max: 1,
			step: 0.01
		}
	})
	const ref = useRef<THREE.InstancedMesh>(null)

	const boxSize = 1
	const scale = 1
	const grid = {
		width: 31,
		height: 31
	}
	const gridCenter = {
		x: Math.floor(grid.width / 2),
		y: Math.floor(grid.height / 2)
	}
	const length = grid.width * grid.height
	const logoPattern = logos[ctrls.pattern]

	const bloomFactorBuffer = useMemo(
		() => new Float32Array(length).map(() => 0),
		[length]
	)
	const faceColorsBuffer = useMemo(
		() => new Float32Array(length * 3).fill(1),
		[length]
	)

	const getCenteredGridMappedValues = useCallback(
		(idx: number) => {
			const logoPattern = logos[ctrls.pattern]
			const logoGridSize = logoPattern.length
			const centerOffset = Math.floor(logoGridSize / 2)

			const y = idx % logoGridSize
			const x = Math.floor(idx / logoGridSize)
			const gridX = gridCenter.x - centerOffset + (logoGridSize - 1 - x)
			const gridY = gridCenter.y - centerOffset + y
			const id = gridY * grid.width + gridX

			return {x, y, gridX, gridY, id}
		},
		[ctrls.pattern, grid.width, gridCenter.x, gridCenter.y]
	)

	useLayoutEffect(() => {
		if (!ref.current || !outlinesRef.current) return

		let i = 0

		for (let x = 0; x < grid.height; x++)
			for (let y = 0; y < grid.width; y++) {
				const id = i++

				// Apply centering offset here
				o.position.set(
					(x - grid.width / 2 + 0.5) * scale,
					(y - grid.height / 2 + 0.5) * scale,
					0
				)

				o.updateMatrix()

				ref.current.setColorAt(id, baseColor)
				ref.current.setMatrixAt(id, o.matrix)
			}

		ref.current.instanceMatrix.needsUpdate = true

		// Re-use geometry + instance matrix
		outlinesRef.current.geometry = ref.current.geometry
		outlinesRef.current.instanceMatrix = ref.current.instanceMatrix
	}, [
		grid.width,
		grid.height,
		length,
		gridCenter.x,
		gridCenter.y,
		baseColor,
		scale
	])

	useEffect(() => {
		if (!ref.current) return

		const logoPatternCopy = JSON.parse(
			JSON.stringify(logoPattern)
		) as typeof logoPattern
		const logoGridSize = logoPattern.length
		const toValues = logoPatternCopy.flat()
		const fromZValues = toValues.map(() => ({v: 0}))
		const fromBloomValues = toValues.map(() => ({v: 0}))

		const staggerConfig: gsap.StaggerVars = {
			each: 0.1,
			grid: [logoGridSize, logoGridSize],
			/* @ts-ignore */
			from: ctrls.gridfrom
		}

		const timeline = gsap.timeline({repeat: -1, repeatDelay: 1, yoyo: true})

		timeline.to(fromBloomValues, {
			duration: 2,
			v: (index: number) => {
				return toValues[index]
			},
			ease: 'power4.in',
			stagger: staggerConfig,
			onUpdate: () => {
				fromBloomValues.forEach((value, index) => {
					if (!ref.current) return
					const {id} = getCenteredGridMappedValues(index)
					bloomFactorBuffer[id] = value.v
					ref.current.geometry.attributes.bloomFactor.needsUpdate = true
				})
			}
		})

		timeline.to(
			fromZValues,
			{
				duration: 1.5,
				v: (index: number) => {
					return toValues[index]
				},
				ease: 'power2.inOut',
				stagger: staggerConfig,
				onUpdate: () => {
					fromZValues.forEach((value, index) => {
						if (!ref.current) return

						const {id} = getCenteredGridMappedValues(index)

						ref.current.getMatrixAt(id, o.matrix)

						o.matrix.decompose(o.position, o.quaternion, o.scale)

						o.position.setZ(value.v * 0.9)

						o.updateMatrix()

						ref.current.setMatrixAt(id, o.matrix)

						if (toValues[index] === 1) {
							ref.current.setColorAt(id, c.copy(baseColor).lerp(activeColor, value.v))
							ref.current.instanceColor!.needsUpdate = true
						}

						ref.current.instanceMatrix.needsUpdate = true
					})
				}
			},
			'<'
		)

		return () => {
			timeline.revert()
			timeline.kill()
		}
	}, [
		activeColor,
		baseColor,
		bloomFactorBuffer,
		ctrls.gridfrom,
		ctrls.pattern,
		getCenteredGridMappedValues,
		grid.width,
		gridCenter.x,
		gridCenter.y,
		logoPattern
	])

	return (
		// Create a centered grid of boxes with the given width and height
		<group>
			<instancedMesh
				scale={scale}
				args={[undefined, undefined, length]}
				ref={ref}>
				<boxGeometry args={[boxSize, boxSize, boxSize]}>
					<instancedBufferAttribute
						attach='attributes-bloomFactor'
						args={[bloomFactorBuffer, 1]}
					/>
					{/* <instancedBufferAttribute
            attach="attributes-color"
            args={[faceColorsBuffer, 3]}
          /> */}
				</boxGeometry>
				<meshBasicMaterial
					color='white'
					toneMapped={false}
				/>
			</instancedMesh>
			<instancedMesh
				scale={scale}
				args={[undefined, undefined, length]}
				ref={outlinesRef}>
				{/* @ts-ignore */}
				<meshEdgesMaterial
					toneMapped={false}
					transparent
					polygonOffset
					polygonOffsetFactor={-1}
					size={[boxSize, boxSize, boxSize]}
					bloomFactor={ctrls.activeBloomFactor}
					color={borderColor}
					thickness={0.01}
					smoothness={0}
				/>
			</instancedMesh>
		</group>
	)
}

function LabWebGL() {
	const ctrls = useControls({
		ambientLight: {
			value: 0.1,
			min: 0,
			max: 1,
			step: 0.01
		},
		toneMapping: {
			value: THREE.ACESFilmicToneMapping,
			options: {
				None: THREE.NoToneMapping,
				Linear: THREE.LinearToneMapping,
				Reinhard: THREE.ReinhardToneMapping,
				Cineon: THREE.CineonToneMapping,
				ACESFilmic: THREE.ACESFilmicToneMapping
			}
		},
		exposure: {
			value: 1,
			min: 0,
			max: 2,
			step: 0.01
		},
		camera: folder({
			fov: {
				value: 45,
				min: 10,
				max: 100,
				step: 1
			}
		}),
		helpers: false,
		bloom: folder({
			radius: {
				value: 0.5,
				min: 0,
				max: 1,
				step: 0.01
			},
			intensity: {
				value: 1.6,
				min: 0,
				max: 2,
				step: 0.01
			},
			levels: {
				value: 9,
				min: 0,
				max: 10,
				step: 0.01
			},
			mipmap: true
		})
	})

	return (
		<Canvas
			gl={{
				alpha: false,
				antialias: false,
				powerPreference: 'high-performance',
				toneMapping: ctrls.toneMapping,
				outputColorSpace: 'srgb',
				toneMappingExposure: ctrls.exposure
			}}
			dpr={[1, 2]}>
			<color
				attach='background'
				args={['#000']}
			/>
			<PerspectiveCamera
				makeDefault
				position={[3, -4, 9]}
				fov={ctrls.fov}
				near={1}
				far={100}
			/>
			<OrbitControls makeDefault />

			<ambientLight intensity={ctrls.ambientLight} />
			<pointLight
				color='white'
				decay={1.56}
				position={[-5, 5, 7]}
				intensity={4}
			/>
			<pointLight
				color='white'
				decay={1.56}
				position={[5, -5, 7]}
				intensity={10}
			/>

			{ctrls.helpers && (
				<>
					<gridHelper args={[20, 20]} />
					<axesHelper args={[5]} />
				</>
			)}

			<Scene />

			{/* @ts-ignore */}
			<EffectComposer disableNormalPass>
				<Bloom
					luminanceThreshold={1}
					intensity={ctrls.intensity}
					levels={ctrls.levels}
					radius={ctrls.radius}
					mipmapBlur={ctrls.mipmap}
				/>
        <SMAA />
			</EffectComposer>
		</Canvas>
	)
}

export default LabWebGL
