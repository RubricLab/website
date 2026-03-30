'use client'

import { useEffect, useRef, useState } from 'react'
import { LogoBar } from '~/components/logo-bar'
import { useScrollProgress } from './use-scroll-progress'
import { PHASES, phaseProgress, easeOut, easeOutCubic, easeInOut, lerp, clamp01 } from './scroll-phases'
import { UserMessage } from './chat/user-message'
import { ReasoningTrace } from './chat/reasoning-trace'
import { SystemResponse } from './chat/system-response'
import { type CaseRef } from './chat/generative-output'
import { ChatInput } from './chat/chat-input'

// ── Content ──────────────────────────────────────────────────────────────

const USER_MSG = 'What makes Rubric different from a typical AI dev shop?'
const RESPONSE =
	"We're a research lab and a product studio. We publish research on agent architectures, then ship those patterns as production systems. Same team does both — no handoff, no translation layer."
const CASES: CaseRef[] = [
	{ client: 'Safeway AI', href: '/work/safeway' },
	{ client: 'Year in Code', href: '/work/year-in-code' },
]

const LAYERS = [
	{ id: 'message', label: 'Prompt', note: 'user · input' },
	{ id: 'reasoning', label: 'Context Engineering', note: 'reasoning · 4 steps' },
	{ id: 'response', label: 'End-to-End Ownership', note: 'output · 42 tokens' },
	{ id: 'genui', label: 'Generative UI', note: 'render · 2 refs' },
]

const W = 520
const PAD = 16
const LAYER_GAP = [0, 20, 40, 60]
const GUIDE_LEN = 60
const OUTER_PAD = 10

// ── Auto-play chat ───────────────────────────────────────────────────────

function useAutoChat(scrollProgress: number): number {
	const [auto, setAuto] = useState(0)
	const raf = useRef(0)
	const start = useRef(0)
	useEffect(() => {
		start.current = performance.now()
		const tick = () => {
			const t = Math.min(1, (performance.now() - start.current) / 4500)
			setAuto(t)
			if (t < 1) raf.current = requestAnimationFrame(tick)
		}
		raf.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf.current)
	}, [])
	return Math.max(auto, scrollProgress > 0 ? phaseProgress(scrollProgress, PHASES.CHAT_BUILD) : 0)
}

// ── Annotation overlay ───────────────────────────────────────────────────
// Outer border (padded out beyond content) + inner border (flush with content)
// + guide lines drawing in from different directions. Content stays visible.

function Annotation({ sep, active, radius = 8 }: {
	sep: number; active: boolean; radius?: number | undefined
}) {
	const t = Math.min(1, sep * 2.5)
	const op = Math.min(0.55, sep * 1.5) * (active ? 1.5 : 1)
	const r = radius + OUTER_PAD / 2

	return (
		<div className="absolute pointer-events-none" style={{ inset: -OUTER_PAD, overflow: 'visible' }}>
			{/* Outer border — pads out beyond content */}
			<div className="absolute inset-0" style={{
				border: `1px solid var(--primary)`, borderRadius: r, opacity: op,
			}} />

			{/* Inner border — flush with content (padding indicator) */}
			{t > 0.3 && (
				<div className="absolute" style={{
					inset: OUTER_PAD,
					border: '1px solid var(--primary)',
					borderRadius: radius,
					opacity: op * 0.25,
				}} />
			)}

			{/* Radius arc */}
			{t > 0.4 && radius > 4 && (
				<svg className="absolute" style={{ left: 0, top: 0, width: r + 16, height: r + 16, overflow: 'visible', opacity: op * 0.35 }}>
					<path d={`M 1 ${r} A ${r - 1} ${r - 1} 0 0 1 ${r} 1`}
						fill="none" stroke="var(--primary)" strokeWidth="0.75" />
					<text x={r + 3} y={12} fontSize="8" fill="var(--primary)" opacity="0.5">r:{radius}</text>
				</svg>
			)}

			{/* Horizontal guides */}
			<div className="absolute h-px" style={{
				right: '100%', top: 0, width: GUIDE_LEN,
				background: 'var(--primary)', opacity: op * 0.45,
				transformOrigin: 'right', transform: `scaleX(${t})`,
			}} />
			<div className="absolute h-px" style={{
				left: '100%', bottom: 0, width: GUIDE_LEN,
				background: 'var(--primary)', opacity: op * 0.35,
				transformOrigin: 'left', transform: `scaleX(${t})`,
			}} />
			{t > 0.3 && (
				<div className="absolute h-px" style={{
					left: '100%', top: 0, width: GUIDE_LEN * 0.4,
					background: 'var(--primary)', opacity: op * 0.2,
					transformOrigin: 'left', transform: `scaleX(${Math.min(1, (t - 0.3) * 3)})`,
				}} />
			)}

			{/* Vertical guides */}
			<div className="absolute w-px" style={{
				left: 0, bottom: '100%', height: GUIDE_LEN,
				background: 'var(--primary)', opacity: op * 0.35,
				transformOrigin: 'bottom', transform: `scaleY(${t})`,
			}} />
			<div className="absolute w-px" style={{
				right: 0, top: '100%', height: GUIDE_LEN,
				background: 'var(--primary)', opacity: op * 0.25,
				transformOrigin: 'top', transform: `scaleY(${t})`,
			}} />
			{t > 0.5 && (
				<div className="absolute w-px" style={{
					left: '50%', bottom: '100%', height: GUIDE_LEN * 0.3,
					background: 'var(--primary)', opacity: op * 0.1,
					transformOrigin: 'bottom', transform: `scaleY(${Math.min(1, (t - 0.5) * 4)})`,
				}} />
			)}

			{/* Mid horizontal */}
			<div className="absolute h-px" style={{
				right: '100%', top: '50%', width: GUIDE_LEN * 0.5,
				background: 'var(--primary)', opacity: op * 0.15,
				transformOrigin: 'right', transform: `scaleX(${Math.min(1, t * 1.5)})`,
			}} />
		</div>
	)
}

// ── Main ─────────────────────────────────────────────────────────────────

export function HeroEngine() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const scrollProgress = useScrollProgress(sectionRef)
	const isScrolling = scrollProgress > 0
	const chatP = useAutoChat(scrollProgress)

	const sep = easeOutCubic(phaseProgress(scrollProgress, PHASES.SEPARATE)) *
		(1 - easeInOut(phaseProgress(scrollProgress, PHASES.REASSEMBLE)))
	const highlightRaw = phaseProgress(scrollProgress, PHASES.HIGHLIGHT)
	const fadeP = easeOut(phaseProgress(scrollProgress, PHASES.FADE_OUT))

	const typingP = clamp01(chatP / 0.15)
	const reasoningP = clamp01((chatP - 0.15) / 0.2)
	const responseP = clamp01((chatP - 0.35) / 0.35)
	const genUIP = clamp01((chatP - 0.7) / 0.3)

	const activeLayer = Math.min(3, Math.floor(highlightRaw * 4))
	const isHL = scrollProgress >= PHASES.HIGHLIGHT.start && scrollProgress < PHASES.HIGHLIGHT.end
	const layerLocal = clamp01(highlightRaw * 4 - activeLayer)

	const introVis = isScrolling ? 0 : 1
	const globalFade = 1 - fadeP
	const chatX = isScrolling ? lerp(140, 0, Math.min(1, phaseProgress(scrollProgress, PHASES.CHAT_BUILD) * 3)) : 140
	const containerVis = Math.max(0, 1 - sep * 2.5)

	// Content dims but never fully disappears
	const contentDim = isHL
		? (i: number) => i === activeLayer ? 1 : 0.1
		: () => Math.max(0.12, 1 - sep * 1.2)

	const pillSpread = sep * 14

	const layerStyle = (i: number): React.CSSProperties => ({
		transform: `translateY(${(LAYER_GAP[i] ?? 0) * sep}px)`,
		opacity: globalFade,
		position: 'relative',
		overflow: 'visible',
	})

	const renderExplanation = () => {
		if (!isHL) return null
		const layer = LAYERS[activeLayer]
		if (!layer) return null
		const fadeIn = easeOutCubic(Math.min(1, layerLocal * 4))
		const fadeOut = layerLocal > 0.75 ? 1 - easeOut((layerLocal - 0.75) / 0.25) : 1
		const op = fadeIn * fadeOut * globalFade
		if (op < 0.01) return null
		return (
			<div className="absolute left-1/2 -translate-x-1/2 text-center" style={{
				bottom: 80,
				opacity: op, zIndex: 20,
				transform: `translateX(-50%) translateY(${(1 - fadeIn) * 8}px)`,
			}}>
				<p className="text-2xl text-primary font-normal tracking-tight">
					{layer.label}
				</p>
				<p className="text-sm text-secondary mt-2">{layer.note}</p>
			</div>
		)
	}

	const renderLayer = (i: number, content: React.ReactNode, opts?: { fitWidth?: boolean; radius?: number }) => {
		const active = isHL && i === activeLayer
		return (
			<div className="mt-3" style={{ ...layerStyle(i), width: opts?.fitWidth ? 'fit-content' : undefined }} key={LAYERS[i]?.id ?? i}>
				<div style={{ opacity: contentDim(i), transition: 'opacity 0.4s' }}>
					{content}
				</div>
				{sep > 0.02 && <Annotation sep={sep} active={active} radius={opts?.radius} />}
			</div>
		)
	}

	return (
		<>
			{/* Mobile */}
			<section className="md:hidden">
				<div className="max-w-[1200px] mx-auto px-6 py-20">
					<h1 className="text-4xl text-primary font-normal leading-[1.1] tracking-tight mb-4">A lab that ships.</h1>
					<p className="text-base text-secondary leading-relaxed mb-6 max-w-[400px]">
						We study how AI agents should be built — then we build them.
					</p>
					<div className="mb-10 overflow-hidden"><LogoBar compact /></div>
					<div className="grid grid-cols-1 gap-3">
						{LAYERS.slice(1).map(l => (
							<div key={l.id} className="border border-subtle rounded-xl p-4">
								<span className="text-xs text-secondary tracking-widest uppercase">{l.label}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Desktop */}
			<section ref={sectionRef} className="relative hidden md:block" style={{ height: '400vh' }}>
				<div className="sticky top-0 h-screen flex items-center justify-center" style={{ zIndex: 10 }}>

					<div className="absolute transition-opacity duration-300" style={{
						left: 'max(2rem, calc(50% - 580px))', top: '50%',
						transform: 'translateY(-50%)', opacity: introVis,
						maxWidth: 400, pointerEvents: introVis < 0.1 ? 'none' : 'auto',
					}}>
						<h1 className="text-[clamp(36px,4.5vw,52px)] text-primary font-normal leading-[1.1] tracking-tight">A lab that ships.</h1>
						<p className="mt-4 text-[15px] text-secondary leading-relaxed max-w-[360px]">
							We study how AI agents should be built — then we build them.
						</p>
						<a href="/work" className="inline-flex items-center gap-2 mt-6 text-[11px] text-secondary hover:text-primary transition-colors tracking-wide uppercase">
							See the work <span>→</span>
						</a>
					</div>

					<div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[560px] overflow-hidden transition-opacity duration-300"
						style={{ opacity: introVis, pointerEvents: introVis < 0.1 ? 'none' : 'auto' }}>
						<LogoBar compact />
					</div>

					<div style={{ opacity: globalFade, transform: `translateX(${chatX}px) translateY(${-sep * 40}px)` }}>
						<div className="relative" style={{ width: W, overflow: 'visible' }}>

							<div className="relative rounded-xl" style={{
								background: chatP > 0 ? `color-mix(in srgb, var(--accent) ${Math.round(50 * containerVis)}%, transparent)` : 'transparent',
								border: chatP > 0 ? `1px solid color-mix(in srgb, var(--subtle) ${Math.round(100 * containerVis)}%, transparent)` : '1px solid transparent',
								padding: PAD, transition: 'background 0.3s, border-color 0.3s',
								overflow: 'visible',
							}}>
								{/* Header */}
								<div className="flex items-center justify-between mb-3" style={{ opacity: Math.min(1, chatP * 4) * containerVis }}>
									<span className="text-[10px] text-secondary tracking-widest uppercase">Rubric</span>
									<span className="relative flex h-1 w-1">
										<span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-20" />
										<span className="relative rounded-full h-1 w-1 bg-primary opacity-40" />
									</span>
								</div>

								{/* Layer 0: User message */}
								{renderLayer(0,
									<div style={{ opacity: Math.min(1, typingP * 3) }}>
										<UserMessage text={USER_MSG} progress={typingP} />
									</div>,
									{ fitWidth: true, radius: 16 }
								)}

								{/* Layer 1: Reasoning */}
								{renderLayer(1,
									reasoningP > 0 ? <ReasoningTrace summary="" steps={4} progress={reasoningP} /> : <div style={{ height: 20 }} />,
									{ fitWidth: true, radius: 6 }
								)}

								{/* Layer 2: Response */}
								{renderLayer(2,
									responseP > 0 ? <SystemResponse text={RESPONSE} progress={responseP} /> : <div style={{ height: 60 }} />,
									{ radius: 6 }
								)}

								{/* Layer 3: GenUI pills — always rendered, spread apart */}
								{renderLayer(3,
									<div className="flex items-center" style={{ gap: `${8 + pillSpread}px` }}>
										{CASES.map((c, ci) => {
											const p = Math.max(0, (genUIP - ci * 0.25) / 0.5)
											return (
												<span key={c.client} className="inline-flex items-center gap-1.5 rounded-full border border-subtle px-3 py-1 text-[11px] text-secondary"
													style={{ opacity: Math.min(1, Math.max(0, p * 2)) }}>
													{c.client}<span className="text-secondary/50">→</span>
												</span>
											)
										})}
									</div>,
									{ fitWidth: true, radius: 14 }
								)}

								{/* Chat input — fades during separation */}
								<div className="mt-3" style={{
									opacity: Math.min(1, chatP * 4) * Math.max(0, 1 - sep * 3),
									transition: 'opacity 0.3s',
								}}>
									<ChatInput />
								</div>
							</div>
						</div>
					</div>

					{renderExplanation()}

					{isScrolling && scrollProgress < 0.95 && (
						<div className="absolute bottom-8 left-1/2 -translate-x-1/2">
							<div className="w-12 h-px bg-subtle rounded-full overflow-hidden">
								<div className="h-full bg-secondary rounded-full" style={{ width: `${scrollProgress * 100}%` }} />
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	)
}
