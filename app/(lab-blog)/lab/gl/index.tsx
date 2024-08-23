import {PerspectiveCamera, shaderMaterial} from '@react-three/drei'
import {Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import {
	Bloom,
	EffectComposer,
	Noise,
	SMAA,
	Vignette
} from '@react-three/postprocessing'
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
		color: new THREE.Color('white'),
		size: new THREE.Vector3(1, 1, 1),
		thickness: 0.02,
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

const patchBasicMaterialBloomFactor = shader => {
	shader.uniforms.bloomFactor = {value: 0}
	shader.vertexShader = shader.vertexShader.replace(
		'#include <common>',
		`#include <common>
	attribute float bloomFactor;
	varying float vBloomFactor;`
	)
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`#include <begin_vertex>
	vBloomFactor = bloomFactor;`
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		'#include <common>',
		`#include <common>
	uniform float bloomFactor;
	varying float vBloomFactor;`
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		'#include <color_fragment>',
		`#include <color_fragment>
	diffuseColor.rgb *= (1.0 + bloomFactor + vBloomFactor);`
	)
}

extend({MeshEdgesMaterial})

const logos = [
	[
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0]
	],
	[
		[1, 0, 1],
		[0, 1, 0],
		[1, 0, 1]
	],
	[
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1]
	],
	[
		[0, 1, 1],
		[1, 0, 1],
		[1, 1, 0]
	]
]

const clone = (arr: any) => {
	return JSON.parse(JSON.stringify(arr))
}

const initialLogoGridState = clone(logos[0])
	.flat()
	.map(v => ({v}))
const initialLogoGridBloomState = clone(initialLogoGridState)

const Scene = ({activeIdx}: {activeIdx: number}) => {
	const refPrevLogoPattern = useRef<number[][]>()
	const refPatternFromZValues = useRef<{v: number}[]>()

	const refLogoGridState = useRef<{v: number}[]>(initialLogoGridState)
	const refLogoGridBloomState = useRef<{v: number}[]>(initialLogoGridBloomState)

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
			value: '#474747',
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
			value: '#fff',
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
	const logoPattern = logos[activeIdx]

	const bloomFactorBuffer = useMemo(
		() => new Float32Array(length).map(() => 0),
		[length]
	)

	const getCenteredGridMappedValues = useCallback(
		(idx: number) => {
			const logoGridSize = logoPattern.length
			const centerOffset = Math.floor(logoGridSize / 2)

			const y = idx % logoGridSize
			const x = Math.floor(idx / logoGridSize)
			const gridX = gridCenter.x - centerOffset + (logoGridSize - 1 - x)
			const gridY = gridCenter.y - centerOffset + y
			const id = gridY * grid.width + gridX

			return {x, y, gridX, gridY, id}
		},
		[grid.width, gridCenter.x, gridCenter.y, logoPattern]
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

		const currentLogoPattern = (
			JSON.parse(JSON.stringify(logoPattern)) as typeof logoPattern
		).flat()
		const currentLogoGridSize = logoPattern.length

		const fromZValues = refLogoGridState.current
		const fromBloomValues = refLogoGridBloomState.current

		const inStaggerConfig: gsap.StaggerVars = {
			each: 0.1,
			grid: [currentLogoGridSize, currentLogoGridSize],
			/* @ts-ignore */
			from: ctrls.gridfrom
		}

		const timeline = gsap.timeline()

		/* first hide everything if there's a prev logo */
		if (refPrevLogoPattern.current)
			timeline.to(fromZValues, {
				duration: 0.5,
				v: 0,
				ease: 'power2.out',
				stagger: inStaggerConfig,
				onUpdate: () => {
					fromZValues.forEach((value, index) => {
						if (!ref.current) return

						const {id} = getCenteredGridMappedValues(index)

						ref.current.getMatrixAt(id, o.matrix)
						o.matrix.decompose(o.position, o.quaternion, o.scale)
						o.position.setZ(value.v * 0.9)
						o.updateMatrix()
						ref.current.setMatrixAt(id, o.matrix)

						ref.current.setColorAt(
							id,
							c.copy(activeColor).lerp(baseColor, 1 - value.v)
						)
						ref.current.instanceColor!.needsUpdate = true
						ref.current.instanceMatrix.needsUpdate = true
					})
				}
			})

		timeline.to(fromBloomValues, {
			duration: 2,
			v: (index: number) => {
				return currentLogoPattern[index]
			},
			ease: 'power4.in',
			stagger: inStaggerConfig,
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
				duration: 0.75,
				v: (index: number) => {
					return currentLogoPattern[index]
				},
				ease: 'power2.inOut',
				stagger: inStaggerConfig,
				onUpdate: () => {
					fromZValues.forEach((value, index) => {
						if (!ref.current) return

						const {id} = getCenteredGridMappedValues(index)

						ref.current.getMatrixAt(id, o.matrix)

						o.matrix.decompose(o.position, o.quaternion, o.scale)

						o.position.setZ(value.v * 0.9)

						o.updateMatrix()

						ref.current.setMatrixAt(id, o.matrix)

						if (currentLogoPattern[index] === 1)
							ref.current.setColorAt(id, c.copy(baseColor).lerp(activeColor, value.v))
						else if (currentLogoPattern[index] === 0)
							ref.current.setColorAt(
								id,
								c.copy(activeColor).lerp(baseColor, 1 - value.v)
							)

						ref.current.instanceColor!.needsUpdate = true
						ref.current.instanceMatrix.needsUpdate = true
					})
				}
			},
			'<'
		)

		return () => {
			refPrevLogoPattern.current = logoPattern
			refPatternFromZValues.current = fromZValues
			// timeline.revert()
			timeline.kill()
		}
	}, [
		activeColor,
		baseColor,
		bloomFactorBuffer,
		ctrls.gridfrom,
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
					onBeforeCompile={patchBasicMaterialBloomFactor}
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
					dithering
					size={[boxSize, boxSize, boxSize]}
					bloomFactor={ctrls.activeBloomFactor}
					color={borderColor}
					thickness={0.0125}
					smoothness={0}
				/>
			</instancedMesh>
		</group>
	)
}

const v3 = new THREE.Vector3()


const cameraMovementTarget = new THREE.Vector2()

const Camera = () => {
	const {domElement} = useThree(s => s.gl)
	const [hovering, setHovering] = useState(false)
	const cameraRef = useRef<THREE.PerspectiveCamera>()
	const ctrls = useControls({
		camera: folder({
			fov: {
				value: 45,
				min: 10,
				max: 100,
				step: 1
			}
		})
	})

	useEffect(() => {
		const handleMouseEnter = () => setHovering(true)
		const handleMouseLeave = () => setHovering(false)

		domElement.addEventListener('mouseenter', handleMouseEnter)
		domElement.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			domElement.removeEventListener('mouseenter', handleMouseEnter)
			domElement.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [domElement])

	useFrame(state => {
		if (cameraRef.current) {
			const {pointer} = state
			const radius = 12

			if (hovering) cameraMovementTarget.copy(pointer)
			else {
				cameraMovementTarget.x = 0
				cameraMovementTarget.y = 0
			}

			const phi = (Math.PI + Math.PI / 5) * (0.5 - cameraMovementTarget.y * 0.025)
			const theta = Math.PI / 2.5 + Math.PI * 2 * -cameraMovementTarget.x * 0.025

			const targetX = radius * Math.sin(phi) * Math.cos(theta)
			const targetY = radius * Math.cos(phi)
			const targetZ = radius * Math.sin(phi) * Math.sin(theta)

			v3.set(targetX, targetY, targetZ)
			cameraRef.current.position.lerp(v3, 0.05)
			cameraRef.current.lookAt(0, 0, 0)
		}
	})

	return (
		<PerspectiveCamera
			makeDefault
			position={[5, -4, 12]}
			fov={ctrls.fov}
			near={1}
			far={100}
			ref={cameraRef}
		/>
	)
}

function LabWebGL({activeProject}: {activeProject: number}) {
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
		helpers: false,
		bloom: folder({
			radius: {
				value: 0.6,
				min: 0,
				max: 1,
				step: 0.01
			},
			intensity: {
				value: 0.4,
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
			<Camera />

			{ctrls.helpers && (
				<>
					<gridHelper args={[20, 20]} />
					<axesHelper args={[5]} />
				</>
			)}

			<Scene activeIdx={activeProject} />

			<EffectComposer
				multisampling={0}
				/* @ts-ignore */
				disableNormalPass>
				<Bloom
					luminanceThreshold={1}
					intensity={ctrls.intensity}
					levels={ctrls.levels}
					radius={ctrls.radius}
					mipmapBlur={ctrls.mipmap}
				/>
				<Noise opacity={0.05} />
				<Vignette
					offset={0.5}
					darkness={0.7}
					eskil={false}
				/>
				<SMAA />
			</EffectComposer>
		</Canvas>
	)
}

export default LabWebGL
