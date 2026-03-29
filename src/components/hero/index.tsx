'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollProgress } from './use-scroll-progress'
import { PHASES, phaseProgress, easeOut, easeOutCubic, easeInOut, lerp, clamp01 } from './scroll-phases'
import { UserMessage } from './chat/user-message'
import { ReasoningTrace } from './chat/reasoning-trace'
import { ToolCalls, type Tool } from './chat/tool-calls'
import { SystemResponse } from './chat/system-response'
import { GenerativeOutput, type CaseRef } from './chat/generative-output'
import { ChatInput } from './chat/chat-input'

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════════════

const USER_MSG = 'What makes Rubric different from a typical AI dev shop?'

const REASONING_SUMMARY = 'Comparing lab + studio model against standard consultancy patterns.'

const TOOLS: Tool[] = [
	{ name: 'query_knowledge_base', time: '45ms' },
	{ name: 'pull_case_studies', time: '82ms' },
]

const SYSTEM_RESPONSE =
	"We're a research lab and a product studio. We publish research on agent architectures, then ship those patterns as production systems. Same team does both — no handoff, no translation layer."

const CASE_REFS: CaseRef[] = [
	{ client: 'Safeway', work: 'AI shopping agent, 12k SKUs', tag: 'Shipped' },
	{ client: 'Cal.com', work: 'Natural language scheduling', tag: 'Shipped' },
	{ client: 'Graphite', work: 'Code review agent pipeline', tag: 'Active' },
]

const LAYERS = [
	{
		id: 'reasoning',
		label: 'Context Engineering',
		title: 'We architect intelligence.',
		body: "Every token in the context window is deliberate — system prompts, memory, retrieval, tool schemas. This is how agents reason, not just respond.",
	},
	{
		id: 'tools',
		label: 'Research to Production',
		title: 'We study, then ship.',
		body: "We research state-of-the-art agent patterns, then build them as production systems. Published papers, shipped products — same team.",
	},
	{
		id: 'response',
		label: 'End-to-End Ownership',
		title: 'No handoff.',
		body: "Architecture to deploy, we own it. Our researchers write production code. Our engineers read papers. There is no translation layer.",
	},
	{
		id: 'genui',
		label: 'Generative UI',
		title: 'Agents compose interfaces.',
		body: "Type-safe components generated in real-time by the agent. Structured data rendered as real UI — not templates, not chat bubbles.",
	},
]

// Z-separation with more vertical spread so connection lines work
const LAYER_Z = [0, -100, -200, -300]
const LAYER_Y = [0, 40, 80, 120]

// ═══════════════════════════════════════════════════════════════════════════
// HYBRID ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

function useHybridProgress(scrollProgress: number): number {
	const [timeProgress, setTimeProgress] = useState(0)
	const startTime = useRef(0)
	const rafRef = useRef(0)

	useEffect(() => {
		startTime.current = performance.now()
		const tick = () => {
			const elapsed = performance.now() - startTime.current
			const autoP = Math.min(0.35, (elapsed / 5000) * 0.35)
			setTimeProgress(autoP)
			if (autoP < 0.35) rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafRef.current)
	}, [])

	return scrollProgress >= 0 ? Math.max(timeProgress, scrollProgress) : timeProgress
}

// ═══════════════════════════════════════════════════════════════════════════
// SKETCHED LINE — SVG path with hand-drawn wobble
// ═══════════════════════════════════════════════════════════════════════════

function sketchedPath(x1: number, y1: number, x2: number, y2: number, seed: number): string {
	// Add slight organic wobble to straight lines
	const midX = (x1 + x2) / 2 + Math.sin(seed * 3.7) * 3
	const midY = (y1 + y2) / 2 + Math.cos(seed * 2.3) * 2
	const cp1x = x1 + (midX - x1) * 0.5 + Math.sin(seed * 5.1) * 1.5
	const cp1y = y1 + (midY - y1) * 0.3
	const cp2x = midX + (x2 - midX) * 0.5 + Math.cos(seed * 4.2) * 1.5
	const cp2y = midY + (y2 - midY) * 0.7
	return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

export function HeroEngine() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const scrollProgress = useScrollProgress(sectionRef)
	const progress = useHybridProgress(scrollProgress)
	const isActive = progress > 0

	// Track layer DOM positions for connection lines
	const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
	const containerRef = useRef<HTMLDivElement>(null)

	// Phases
	const chatP = phaseProgress(progress, PHASES.CHAT_BUILD)
	const tiltP = easeOutCubic(phaseProgress(progress, PHASES.TILT))
	const separateP = easeOutCubic(phaseProgress(progress, PHASES.SEPARATE))
	const highlightRaw = phaseProgress(progress, PHASES.HIGHLIGHT)
	const reassembleP = easeInOut(phaseProgress(progress, PHASES.REASSEMBLE))
	const fadeP = easeOut(phaseProgress(progress, PHASES.FADE_OUT))

	// Chat sub-progress
	const typingP = clamp01(chatP / 0.18)
	const reasoningP = clamp01((chatP - 0.18) / 0.18)
	const toolsP = clamp01((chatP - 0.36) / 0.16)
	const responseP = clamp01((chatP - 0.52) / 0.24)
	const genUIP = clamp01((chatP - 0.76) / 0.24)

	// 3D
	const tiltAmount = tiltP * (1 - reassembleP)
	const rotY = tiltAmount * -28
	const rotX = tiltAmount * 16
	const sepAmount = separateP * (1 - reassembleP)

	// Highlight
	const activeLayer = Math.min(3, Math.floor(highlightRaw * 4))
	const layerLocal = clamp01(highlightRaw * 4 - activeLayer)
	const isHighlighting = progress >= PHASES.HIGHLIGHT.start && progress < PHASES.HIGHLIGHT.end

	// Layout
	const headlineOpacity = isActive ? Math.max(0, 1 - chatP * 5) : 1
	const headlineX = isActive ? -30 * Math.min(1, chatP * 5) : 0
	const chatOffsetX = isActive ? lerp(120, 0, Math.min(1, chatP * 4)) : 120
	const tiltShiftX = tiltAmount * -80
	const globalFade = 1 - fadeP

	// ── Layer style — soft rounded edges, warm accent ──────────────
	function getLayerStyle(index: number): React.CSSProperties {
		const z = LAYER_Z[index] * sepAmount
		const y = LAYER_Y[index] * sepAmount

		let opacity = 1
		let scale = 1
		let accentOpacity = 0
		let glow = 'none'

		if (isHighlighting) {
			if (index === activeLayer) {
				const fwd = easeInOut(Math.min(1, layerLocal * 3))
				const bwd = layerLocal > 0.7 ? easeInOut((layerLocal - 0.7) / 0.3) : 0
				const pull = fwd * (1 - bwd)
				scale = 1 + 0.01 * pull
				accentOpacity = 0.5 * pull
				glow = `inset 2px 0 0 var(--accent), 0 0 30px var(--accent-soft)`
			} else {
				opacity = 0.15
			}
		}

		// Soft left accent during separation
		const sepVis = Math.min(1, sepAmount * 2)
		const edgeAccent = accentOpacity > 0
			? glow
			: sepVis > 0.05
				? `inset 2px 0 0 var(--border)`
				: 'none'

		return {
			transform: `translate3d(0px, ${y}px, ${z}px) scale(${scale})`,
			opacity: opacity * globalFade,
			boxShadow: edgeAccent,
			padding: sepVis > 0.05 ? '8px 12px 8px 14px' : '0px',
			borderRadius: sepVis > 0.05 ? '12px' : '0px',
			willChange: 'transform, opacity',
			transformStyle: 'preserve-3d' as const,
			transition: isHighlighting ? 'opacity 0.25s ease' : 'none',
			position: 'relative' as const,
		}
	}

	// ── Sketched connection lines between layers ──────────────────
	function renderTraces() {
		if (sepAmount < 0.15) return null
		const traceOp = Math.min(0.6, sepAmount * 1.2) * globalFade
		if (traceOp < 0.01) return null

		// Total SVG height needs to cover all layers
		const totalHeight = LAYER_Y[3] * sepAmount + 60
		const svgWidth = 40

		return (
			<svg
				className="absolute pointer-events-none"
				style={{
					left: -30,
					top: 0,
					width: svgWidth,
					height: totalHeight,
					overflow: 'visible',
					transformStyle: 'preserve-3d',
				}}
			>
				{/* Sketch filter for hand-drawn feel */}
				<defs>
					<filter id="sketch-roughen">
						<feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise" seed="2" />
						<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
					</filter>
				</defs>
				{[0, 1, 2].map((i) => {
					const fromY = LAYER_Y[i] * sepAmount + 16
					const toY = LAYER_Y[i + 1] * sepAmount + 16

					const isActiveTrace = isHighlighting && (i === activeLayer || i + 1 === activeLayer)
					const op = isActiveTrace ? traceOp * 1.5 : traceOp * (isHighlighting ? 0.2 : 0.5)

					return (
						<g key={`trace-${i}`} opacity={op} filter="url(#sketch-roughen)">
							{/* Main sketched connection line */}
							<path
								d={sketchedPath(20, fromY, 20, toY, i + 1)}
								fill="none"
								stroke={isActiveTrace ? 'var(--accent)' : 'var(--border)'}
								strokeWidth={isActiveTrace ? 1.5 : 1}
								strokeLinecap="round"
								strokeDasharray={isActiveTrace ? 'none' : '3 4'}
							/>
							{/* Small dot at start */}
							<circle
								cx={20} cy={fromY} r={2}
								fill={isActiveTrace ? 'var(--accent)' : 'var(--text-tertiary)'}
							/>
							{/* Small dot at end */}
							<circle
								cx={20} cy={toY} r={2}
								fill={isActiveTrace ? 'var(--accent)' : 'var(--text-tertiary)'}
							/>
						</g>
					)
				})}
			</svg>
		)
	}

	// ── Labels ────────────────────────────────────────────────────────
	function renderLabels() {
		if (sepAmount < 0.25) return null
		const baseOp = Math.min(1, (sepAmount - 0.25) / 0.3) * globalFade

		return LAYERS.map((layer, i) => {
			const op = isHighlighting
				? (i === activeLayer ? baseOp : baseOp * 0.1)
				: baseOp * 0.5
			if (op < 0.01) return null

			const y = LAYER_Y[i] * sepAmount
			const z = LAYER_Z[i] * sepAmount
			const isActive = i === activeLayer && isHighlighting

			return (
				<div
					key={layer.id}
					className="absolute pointer-events-none"
					style={{
						right: -8, top: 0,
						transform: `translate3d(100%, ${y}px, ${z}px)`,
						opacity: op,
						transformStyle: 'preserve-3d',
						paddingLeft: 14,
					}}
				>
					<div className="flex items-center gap-2">
						<div className="w-[16px] h-[1px]" style={{
							background: isActive ? 'var(--accent)' : 'var(--border)',
						}} />
						<span className="font-sans text-[9px] tracking-[0.14em] uppercase whitespace-nowrap" style={{
							color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
						}}>
							{String(i + 1).padStart(2, '0')} {layer.label}
						</span>
					</div>
				</div>
			)
		})
	}

	// ── Explanation panel ─────────────────────────────────────────────
	function renderExplanation() {
		if (!isHighlighting) return null

		const layer = LAYERS[activeLayer]
		const panelIn = easeOutCubic(Math.min(1, layerLocal * 3))
		const panelOut = layerLocal > 0.72 ? 1 - easeOut((layerLocal - 0.72) / 0.28) : 1
		const op = panelIn * panelOut * globalFade
		if (op < 0.01) return null

		const slideX = (1 - panelIn) * 16
		const labelD = panelIn > 0.1 ? Math.min(1, (panelIn - 0.1) / 0.25) : 0
		const titleD = panelIn > 0.2 ? Math.min(1, (panelIn - 0.2) / 0.25) : 0
		const bodyD = panelIn > 0.35 ? Math.min(1, (panelIn - 0.35) / 0.3) : 0

		return (
			<div
				className="absolute w-[260px]"
				style={{
					right: 'calc(50% + 300px)',
					top: '50%',
					transform: `translateY(-50%) translateX(${-slideX}px)`,
					opacity: op,
					zIndex: 20,
				}}
			>
				<div className="border-l-2 border-accent pl-4" style={{ borderColor: 'var(--accent)' }}>
					<p className="font-sans text-[10px] tracking-[0.16em] uppercase mb-2.5"
						style={{ opacity: labelD, color: 'var(--accent)', transform: `translateY(${(1 - labelD) * 5}px)` }}>
						{layer.label}
					</p>
					<h2 className="font-sans text-[22px] font-normal leading-[1.2] tracking-tight mb-2.5"
						style={{ opacity: titleD, color: 'var(--text-primary)', transform: `translateY(${(1 - titleD) * 6}px)` }}>
						{layer.title}
					</h2>
					<p className="font-sans text-[13px] leading-[1.65]"
						style={{ opacity: bodyD, color: 'var(--text-secondary)', transform: `translateY(${(1 - bodyD) * 5}px)` }}>
						{layer.body}
					</p>
				</div>
			</div>
		)
	}

	// User msg dims during engine view
	const userMsgOp = isHighlighting ? 0.1 : sepAmount > 0 ? Math.max(0.15, 1 - sepAmount) : 1

	return (
		<>
			{/* Mobile */}
			<section className="md:hidden">
				<div className="max-w-[1200px] mx-auto px-6 py-24">
					<h1 className="font-sans text-4xl text-text-primary font-normal leading-[1.1] tracking-tight mb-5">
						A lab that ships.
					</h1>
					<p className="font-sans text-base text-text-secondary leading-relaxed mb-12 max-w-[400px]">
						We study how AI agents should be built — then we build them.
					</p>
					<div className="grid grid-cols-1 gap-4">
						{LAYERS.map((l) => (
							<div key={l.id} className="border border-border rounded-2xl p-5">
								<h3 className="font-sans text-[10px] text-text-tertiary tracking-widest uppercase mb-2">{l.label}</h3>
								<h4 className="font-sans text-lg text-text-primary mb-2">{l.title}</h4>
								<p className="font-sans text-sm text-text-secondary leading-relaxed">{l.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Desktop */}
			<section
				ref={sectionRef}
				className="relative hidden md:block"
				style={{ height: '600vh' }}
			>
				<div
					className="sticky top-0 h-screen flex items-center justify-center overflow-x-clip"
					style={{ zIndex: 10 }}
				>
					{/* Headline */}
					<div
						className="absolute"
						style={{
							left: 'max(2rem, calc(50% - 540px))',
							top: '50%',
							transform: `translateY(-50%) translateX(${headlineX}px)`,
							opacity: headlineOpacity,
							maxWidth: 340,
							pointerEvents: headlineOpacity < 0.1 ? 'none' : 'auto',
						}}
					>
						<h1 className="font-sans text-[clamp(36px,4.5vw,52px)] text-text-primary font-normal leading-[1.1] tracking-tight">
							A lab that ships.
						</h1>
						<p className="mt-4 font-sans text-[15px] text-text-secondary leading-relaxed max-w-[340px]">
							We study how AI agents should be built — then we build them.
						</p>
						<a href="/work" className="inline-flex items-center gap-2 mt-6 font-sans text-[11px] text-text-tertiary hover:text-text-primary transition-colors duration-200 tracking-wide uppercase">
							See the work <span>→</span>
						</a>
					</div>

					{/* Perspective container */}
					<div style={{
						perspective: '900px',
						transformStyle: 'preserve-3d',
						opacity: globalFade,
					}}>
						<div
							ref={containerRef}
							className="relative"
							style={{
								width: 420,
								transformStyle: 'preserve-3d',
								transform: `translateX(${chatOffsetX + tiltShiftX}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
							}}
						>
							{/* Header */}
							<div
								className="flex items-center justify-between px-0.5 mb-2.5"
								style={{ opacity: Math.min(1, chatP * 6) * (isHighlighting ? 0.08 : 1) }}
							>
								<span className="font-sans text-[9px] text-text-tertiary tracking-[0.14em] uppercase">
									Rubric
								</span>
								<span className="relative flex h-[4px] w-[4px]">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-25" style={{ backgroundColor: 'var(--accent)' }} />
									<span className="relative inline-flex rounded-full h-[4px] w-[4px] opacity-60" style={{ backgroundColor: 'var(--accent)' }} />
								</span>
							</div>

							{/* User message */}
							<div style={{
								opacity: Math.min(1, typingP * 3) * userMsgOp * globalFade,
								transition: isHighlighting ? 'opacity 0.25s' : 'none',
							}}>
								<UserMessage text={USER_MSG} progress={typingP} />
							</div>

							{/* Layer 0: Reasoning */}
							<div
								ref={el => { layerRefs.current[0] = el }}
								className="mt-3"
								style={getLayerStyle(0)}
							>
								{reasoningP > 0 && (
									<ReasoningTrace
										summary={REASONING_SUMMARY}
										steps={4}
										progress={reasoningP}
									/>
								)}
							</div>

							{/* Layer 1: Tool Calls */}
							<div
								ref={el => { layerRefs.current[1] = el }}
								className="mt-2"
								style={getLayerStyle(1)}
							>
								<ToolCalls tools={TOOLS} progress={toolsP} />
							</div>

							{/* Layer 2: Response */}
							<div
								ref={el => { layerRefs.current[2] = el }}
								className="mt-3"
								style={getLayerStyle(2)}
							>
								{responseP > 0 && (
									<SystemResponse text={SYSTEM_RESPONSE} progress={responseP} />
								)}
							</div>

							{/* Layer 3: GenUI */}
							<div
								ref={el => { layerRefs.current[3] = el }}
								className="mt-2"
								style={getLayerStyle(3)}
							>
								<GenerativeOutput cases={CASE_REFS} progress={genUIP} />
							</div>

							{/* Input */}
							<div className="mt-3" style={{
								opacity: Math.min(1, chatP * 6) * globalFade * (sepAmount > 0.1 ? Math.max(0.03, 1 - sepAmount * 3) : 1),
							}}>
								<ChatInput />
							</div>

							{/* Sketched connection traces */}
							{renderTraces()}

							{/* Labels */}
							{renderLabels()}
						</div>
					</div>

					{/* Explanation */}
					{renderExplanation()}

					{/* Scroll prompt */}
					{progress === 0 && (
						<div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fadeIn">
							<div className="flex flex-col items-center gap-2">
								<p className="font-sans text-[10px] text-text-tertiary tracking-wide">Scroll to explore</p>
								<span className="text-text-tertiary animate-bounce-gentle text-xs">↓</span>
							</div>
						</div>
					)}

					{/* Progress bar */}
					{isActive && scrollProgress >= 0 && progress < 0.98 && (
						<div className="absolute bottom-8 left-1/2 -translate-x-1/2">
							<div className="w-[48px] h-[1px] rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
								<div className="h-full rounded-full transition-colors duration-300" style={{
									width: `${progress * 100}%`,
									backgroundColor: isHighlighting ? 'var(--accent)' : 'var(--text-tertiary)',
								}} />
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	)
}
