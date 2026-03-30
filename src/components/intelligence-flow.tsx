'use client'

import { useEffect, useRef, useCallback } from 'react'

// ——————————————————————————————————————————
// Topology — an agent reasoning pipeline
// ——————————————————————————————————————————

interface Node {
	label: string
	x: number // 0–1 normalized
	y: number
}

interface Edge {
	from: number
	to: number
}

const NODES: Node[] = [
	{ label: 'Input', x: 0.48, y: 0.5 },
	{ label: 'Reason', x: 0.57, y: 0.5 },
	{ label: 'Memory', x: 0.69, y: 0.15 },
	{ label: 'Execute', x: 0.69, y: 0.5 },
	{ label: 'Context', x: 0.69, y: 0.85 },
	{ label: 'Synthesize', x: 0.81, y: 0.5 },
	{ label: 'Render', x: 0.93, y: 0.3 },
	{ label: 'Stream', x: 0.93, y: 0.7 },
]

const EDGES: Edge[] = [
	{ from: 0, to: 1 },
	{ from: 1, to: 2 },
	{ from: 1, to: 3 },
	{ from: 1, to: 4 },
	{ from: 2, to: 5 },
	{ from: 3, to: 5 },
	{ from: 4, to: 5 },
	{ from: 5, to: 6 },
	{ from: 5, to: 7 },
]

// Cross-links (fainter, showing inter-node communication)
const CROSS_LINKS: Edge[] = [
	{ from: 2, to: 3 },
	{ from: 3, to: 4 },
]

// Annotations that cycle through
const ANNOTATIONS = [
	{ nodeIdx: 1, text: 'decompose → 3 subtasks', offsetY: 1 },
	{ nodeIdx: 2, text: 'retrieved 847 tokens', offsetY: 1 },
	{ nodeIdx: 3, text: 'tool_call: db.query', offsetY: 1 },
	{ nodeIdx: 4, text: 'k=8 chunks retrieved', offsetY: 1 },
	{ nodeIdx: 5, text: 'merge & rank results', offsetY: 1 },
	{ nodeIdx: 7, text: '42 tok/s', offsetY: 1 },
]

// ——————————————————————————————————————————
// Math helpers
// ——————————————————————————————————————————

interface Vec2 {
	x: number
	y: number
}

function bezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
	const mt = 1 - t
	return {
		x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
		y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
	}
}

function edgeControlPoints(from: Vec2, to: Vec2): [Vec2, Vec2, Vec2, Vec2] {
	const dx = to.x - from.x
	return [from, { x: from.x + dx * 0.42, y: from.y }, { x: to.x - dx * 0.42, y: to.y }, to]
}

// ——————————————————————————————————————————
// Particle state
// ——————————————————————————————————————————

interface Particle {
	edge: number
	t: number
	speed: number
	radius: number
	brightness: number
}

function createParticles(): Particle[] {
	const particles: Particle[] = []
	EDGES.forEach((_, i) => {
		const count = 2 + Math.floor(Math.random() * 2)
		for (let j = 0; j < count; j++) {
			particles.push({
				edge: i,
				t: Math.random(),
				speed: 0.12 + Math.random() * 0.1,
				radius: 1.2 + Math.random() * 0.8,
				brightness: 0.5 + Math.random() * 0.5,
			})
		}
	})
	return particles
}

// ——————————————————————————————————————————
// Canvas renderer
// ——————————————————————————————————————————

export function IntelligenceFlow() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const mouseRef = useRef<Vec2 | null>(null)
	const particlesRef = useRef<Particle[]>(createParticles())
	const prevTimeRef = useRef(0)
	const entranceRef = useRef(0)
	const annotationRef = useRef({ index: 0, timer: 0 })
	const colorsRef = useRef({ green: '#4ade80', muted: '#a8a29e', bg: '#0c0a09' })
	const sizeRef = useRef({ w: 0, h: 0 })

	// Read CSS variables once and when theme changes
	const syncColors = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const s = getComputedStyle(canvas)
		colorsRef.current = {
			green: s.getPropertyValue('--primary').trim() || '#4ade80',
			muted: s.getPropertyValue('--secondary').trim() || '#a8a29e',
			bg: s.getPropertyValue('--background').trim() || '#0c0a09',
		}
	}, [])

	// Resize canvas via ResizeObserver (not in render loop)
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect
				if (width > 0 && height > 0) {
					const dpr = Math.min(window.devicePixelRatio || 1, 2)
					canvas.width = Math.round(width * dpr)
					canvas.height = Math.round(height * dpr)
					sizeRef.current = { w: width, h: height }
					syncColors()
				}
			}
		})
		ro.observe(canvas)
		return () => ro.disconnect()
	}, [syncColors])

	const render = useCallback((now: number) => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Timing
		if (!prevTimeRef.current) prevTimeRef.current = now
		const dt = Math.min((now - prevTimeRef.current) / 1000, 0.05)
		prevTimeRef.current = now

		// Entrance easing (3s total)
		entranceRef.current = Math.min(1, entranceRef.current + dt / 3)
		const entrance = entranceRef.current

		// Annotation cycling (every 2.8s)
		annotationRef.current.timer += dt
		if (annotationRef.current.timer > 2.8) {
			annotationRef.current.timer = 0
			annotationRef.current.index = (annotationRef.current.index + 1) % ANNOTATIONS.length
		}

		// Canvas sizing — handled by ResizeObserver, just read current size
		const { w, h } = sizeRef.current
		if (w === 0 || h === 0) return
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		ctx.clearRect(0, 0, w, h)

		const { green, muted } = colorsRef.current

		// On mobile, shift the flow left and center it
		const isMobile = w < 768
		const xShift = isMobile ? -0.38 : 0
		const p = (n: Node): Vec2 => ({ x: (n.x + xShift) * w, y: n.y * h })

		// ——— Mouse glow ———
		const mouse = mouseRef.current
		if (mouse) {
			const mx = mouse.x * w
			const my = mouse.y * h
			const radius = Math.min(w, h) * 0.25
			const grad = ctx.createRadialGradient(mx, my, 0, mx, my, radius)
			grad.addColorStop(0, green)
			grad.addColorStop(1, 'transparent')
			ctx.globalAlpha = 0.035
			ctx.fillStyle = grad
			ctx.beginPath()
			ctx.arc(mx, my, radius, 0, Math.PI * 2)
			ctx.fill()
			ctx.globalAlpha = 1
		}

		// ——— Cross-links (very faint) ———
		CROSS_LINKS.forEach((edge) => {
			const fadeIn = Math.max(0, Math.min(1, (entrance - 0.5) * 3))
			if (fadeIn <= 0) return
			const a = p(NODES[edge.from]!)
			const b = p(NODES[edge.to]!)
			ctx.beginPath()
			ctx.moveTo(a.x, a.y)
			ctx.lineTo(b.x, b.y)
			ctx.strokeStyle = muted
			ctx.globalAlpha = 0.04 * fadeIn
			ctx.lineWidth = 0.5
			ctx.setLineDash([4, 6])
			ctx.stroke()
			ctx.setLineDash([])
			ctx.globalAlpha = 1
		})

		// ——— Edges (draw-in animation) ———
		EDGES.forEach((edge, i) => {
			const stagger = i * 0.04
			const edgeProgress = Math.max(0, Math.min(1, (entrance - stagger) * 2.5))
			if (edgeProgress <= 0) return

			const cp = edgeControlPoints(p(NODES[edge.from]!), p(NODES[edge.to]!))
			ctx.beginPath()
			const steps = 60
			const maxStep = Math.round(steps * edgeProgress)
			for (let s = 0; s <= maxStep; s++) {
				const pt = bezier(cp[0], cp[1], cp[2], cp[3], s / steps)
				s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
			}
			ctx.strokeStyle = muted
			ctx.globalAlpha = 0.15
			ctx.lineWidth = 1
			ctx.stroke()
			ctx.globalAlpha = 1
		})

		// ——— Particles ———
		particlesRef.current.forEach((part) => {
			part.t += part.speed * dt
			if (part.t > 1) part.t -= 1

			const edgeDelay = part.edge * 0.04
			const particleFade = Math.max(0, Math.min(1, (entrance - edgeDelay - 0.25) * 4))
			if (particleFade <= 0) return

			const edge = EDGES[part.edge]!
			const cp = edgeControlPoints(p(NODES[edge.from]!), p(NODES[edge.to]!))
			const pos = bezier(cp[0], cp[1], cp[2], cp[3], part.t)

			// Trail (faint, slightly behind)
			for (let trail = 3; trail >= 1; trail--) {
				const tt = part.t - trail * 0.025
				if (tt < 0) continue
				const tp = bezier(cp[0], cp[1], cp[2], cp[3], tt)
				ctx.beginPath()
				ctx.arc(tp.x, tp.y, part.radius * 0.7, 0, Math.PI * 2)
				ctx.fillStyle = green
				ctx.globalAlpha = 0.08 * part.brightness * particleFade * (1 - trail / 4)
				ctx.fill()
			}

			// Glow halo
			const glowR = part.radius * 5
			const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR)
			glowGrad.addColorStop(0, green)
			glowGrad.addColorStop(1, 'transparent')
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2)
			ctx.fillStyle = glowGrad
			ctx.globalAlpha = 0.18 * part.brightness * particleFade
			ctx.fill()

			// Core
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, part.radius, 0, Math.PI * 2)
			ctx.fillStyle = green
			ctx.globalAlpha = 0.85 * part.brightness * particleFade
			ctx.fill()
			ctx.globalAlpha = 1
		})

		// ——— Nodes ———
		NODES.forEach((node, i) => {
			const nodeFade = Math.max(0, Math.min(1, (entrance - 0.15 - i * 0.04) * 3))
			if (nodeFade <= 0) return
			const pos = p(node)
			const baseR = 3.5 * Math.max(0.6, w / 1200)
			const pulse = 0.85 + 0.15 * Math.sin(now / 1200 + i * 1.5)

			// Ambient glow ring
			const ringR = baseR * 4 * pulse
			const ringGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, ringR)
			ringGrad.addColorStop(0, green)
			ringGrad.addColorStop(1, 'transparent')
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, ringR, 0, Math.PI * 2)
			ctx.fillStyle = ringGrad
			ctx.globalAlpha = 0.1 * nodeFade * pulse
			ctx.fill()

			// Outer dot
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, baseR, 0, Math.PI * 2)
			ctx.fillStyle = green
			ctx.globalAlpha = 0.5 * nodeFade
			ctx.fill()

			// Inner bright center
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, baseR * 0.4, 0, Math.PI * 2)
			ctx.fillStyle = green
			ctx.globalAlpha = 0.9 * nodeFade
			ctx.fill()

			// Label
			const fontSize = Math.max(9, 10.5 * (w / 1200))
			ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`
			ctx.textAlign = 'center'
			ctx.fillStyle = muted
			ctx.globalAlpha = 0.45 * nodeFade
			ctx.fillText(node.label, pos.x, pos.y - baseR - 10)
			ctx.globalAlpha = 1
		})

		// ——— Active annotation ———
		const ann = ANNOTATIONS[annotationRef.current.index]
		if (ann && entrance > 0.6) {
			const node = NODES[ann.nodeIdx]!
			const pos = p(node)
			const baseR = 3.5 * Math.max(0.6, w / 1200)
			const fontSize = Math.max(8, 9 * (w / 1200))

			// Fade in/out based on timer position
			const timer = annotationRef.current.timer
			const annAlpha = timer < 0.4 ? timer / 0.4 : timer > 2.4 ? (2.8 - timer) / 0.4 : 1

			ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`
			ctx.textAlign = 'center'
			ctx.fillStyle = green
			ctx.globalAlpha = 0.3 * annAlpha * Math.max(0, (entrance - 0.6) * 2.5)
			ctx.fillText(ann.text, pos.x, pos.y + baseR + 18)
			ctx.globalAlpha = 1
		}

	}, [syncColors])

	// Start animation loop
	useEffect(() => {
		syncColors()
		// Use setInterval as driver — works in background tabs and headless contexts
		const interval = setInterval(() => render(performance.now()), 16)
		return () => clearInterval(interval)
	}, [render, syncColors])

	// Watch for theme changes
	useEffect(() => {
		const observer = new MutationObserver(() => syncColors())
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
		return () => observer.disconnect()
	}, [syncColors])

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const rect = canvasRef.current?.getBoundingClientRect()
		if (!rect) return
		mouseRef.current = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height,
		}
	}, [])

	return (
		<div className="absolute inset-x-0 top-0 bottom-[35%] z-0 overflow-hidden md:bottom-0">
			{/* Left fade (desktop) — keeps hero text readable */}
			<div
				className="pointer-events-none absolute inset-0 z-10 hidden md:block"
				style={{
					background:
						'linear-gradient(to right, var(--background) 0%, var(--background) 40%, transparent 52%)',
				}}
			/>
			{/* Bottom + side fades (mobile) */}
			<div
				className="pointer-events-none absolute inset-0 z-10 md:hidden"
				style={{
					background:
						'linear-gradient(to bottom, transparent 0%, transparent 50%, var(--background) 92%)',
				}}
			/>
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				onMouseMove={handleMouseMove}
				onMouseLeave={() => {
					mouseRef.current = null
				}}
			/>
		</div>
	)
}
