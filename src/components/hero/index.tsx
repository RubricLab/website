'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LogoBar } from '~/components/logo-bar'
import { useScrollProgress } from './use-scroll-progress'
import { PHASES, phaseProgress, easeOut, easeOutCubic, clamp01, deriveHeroState } from './scroll-phases'
import { useLayout } from './use-layout'
import { ScaffoldOverlay } from './scaffold'
import { Expansions } from './expansions'
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

const HIGHLIGHT_CONTENT = [
	{ mono: '01 — Context', heading: 'Every token is deliberate.' },
	{ mono: '02 — Architecture', heading: 'Four steps, three in parallel.' },
	{ mono: '03 — Evaluation', heading: 'Every output is scored.' },
]

const W = 520
const PAD = 16

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
	const introP = scrollProgress > 0 ? phaseProgress(scrollProgress, PHASES.INTRO) : 0
	return Math.max(auto, introP)
}

// ── Main ─────────────────────────────────────────────────────────────────

export function HeroEngine() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const componentRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
	const setComponentRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
		componentRefs.current[index] = el
	}, [])

	const scrollProgress = useScrollProgress(sectionRef)
	const isScrolling = scrollProgress > 0
	const chatP = useAutoChat(scrollProgress)
	const layoutRef = useLayout(containerRef, componentRefs)

	// Derive the full hero state from scroll progress
	const heroState = deriveHeroState(scrollProgress)

	// Chat build sub-progress
	const typingP = clamp01(chatP / 0.15)
	const reasoningP = clamp01((chatP - 0.15) / 0.2)
	const responseP = clamp01((chatP - 0.35) / 0.35)
	const genUIP = clamp01((chatP - 0.7) / 0.3)

	// Component text opacity (ghost = 0, active/focused = 1)
	const textOpacity = heroState.components.map(s => {
		if (s === 'ghost') return 0
		if (s === 'hidden') return 0
		return 1
	})

	// Intro text/logos visibility
	const introVis = isScrolling ? 0 : 1

	// Chat container opacity (fades at the very end of REASSEMBLE)
	const reassembleP = phaseProgress(scrollProgress, PHASES.REASSEMBLE)
	const globalFade = reassembleP > 0.8 ? 1 - easeOut((reassembleP - 0.8) / 0.2) : 1

	// Chat container border/bg (visible once chat builds, fades during annotation)
	const annotateP = phaseProgress(scrollProgress, PHASES.ANNOTATE)
	const containerBgVis = Math.max(0, 1 - annotateP * 2)

	// Container measured dimensions
	const containerW = containerRef.current?.offsetWidth || W
	const containerH = containerRef.current?.offsetHeight || 300

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
					<div className="grid grid-cols-1 gap-6">
						{HIGHLIGHT_CONTENT.map((item, i) => (
							<div key={item.mono} className="border border-subtle rounded-xl p-5">
								<span className="text-[10px] text-secondary tracking-[0.15em] font-mono uppercase block mb-2">
									{item.mono}
								</span>
								<h3 className="text-base text-primary font-normal leading-snug">
									{item.heading}
								</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Desktop */}
			<section ref={sectionRef} className="relative hidden md:block" style={{ height: '1100vh' }}>
				<div className="sticky top-0 h-screen flex items-center justify-center" style={{
					zIndex: 10, overflow: 'visible',
				}}>

					{/* Intro text (left side, visible before scrolling) */}
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

					{/* Logo bar (bottom, visible before scrolling) */}
					<div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[560px] overflow-hidden transition-opacity duration-300"
						style={{ opacity: introVis, pointerEvents: introVis < 0.1 ? 'none' : 'auto' }}>
						<LogoBar compact />
					</div>

					{/* Chat container */}
					<div
						ref={containerRef}
						className="relative"
						style={{
							width: W,
							overflow: 'visible',
							opacity: globalFade,
						}}
					>
						{/* Chat background/border (fades as scaffold takes over) */}
						<div className="absolute inset-0 rounded-xl" style={{
							background: chatP > 0 ? `color-mix(in srgb, var(--accent) ${Math.round(50 * containerBgVis)}%, transparent)` : 'transparent',
							border: chatP > 0 ? `1px solid color-mix(in srgb, var(--subtle) ${Math.round(100 * containerBgVis)}%, transparent)` : '1px solid transparent',
							transition: 'background 0.3s, border-color 0.3s',
							pointerEvents: 'none',
						}} />

						<div style={{ padding: PAD }}>
							{/* Header */}
							<div className="flex items-center justify-between mb-3" style={{
								opacity: Math.min(1, chatP * 4) * containerBgVis,
							}}>
								<span className="text-[10px] text-secondary tracking-widest uppercase">Rubric</span>
								<span className="relative flex h-1 w-1">
									<span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-20" />
									<span className="relative rounded-full h-1 w-1 bg-primary opacity-40" />
								</span>
							</div>

							{/* /01 — Question */}
							<div ref={setComponentRef(0)} className="mt-3" style={{
								opacity: textOpacity[0],
								transition: 'opacity 0.4s',
								position: 'relative',
								overflow: 'visible',
							}}>
								<div style={{ opacity: Math.min(1, typingP * 3) }}>
									<UserMessage text={USER_MSG} progress={typingP} />
								</div>
							</div>

							{/* /02 — Reasoning */}
							<div ref={setComponentRef(1)} className="mt-3" style={{
								opacity: textOpacity[1],
								transition: 'opacity 0.4s',
								position: 'relative',
								overflow: 'visible',
							}}>
								{reasoningP > 0
									? <ReasoningTrace summary="" steps={4} progress={reasoningP} />
									: <div style={{ height: 20 }} />
								}
							</div>

							{/* /03 — Response */}
							<div ref={setComponentRef(2)} className="mt-3" style={{
								opacity: textOpacity[2],
								transition: 'opacity 0.4s',
								position: 'relative',
								overflow: 'visible',
							}}>
								{responseP > 0
									? <SystemResponse text={RESPONSE} progress={responseP} />
									: <div style={{ height: 60 }} />
								}
							</div>

							{/* /04 — Citations */}
							<div ref={setComponentRef(3)} className="mt-3" style={{
								opacity: textOpacity[3],
								transition: 'opacity 0.4s',
								position: 'relative',
								overflow: 'visible',
							}}>
								<div className="flex items-center gap-2">
									{CASES.map((c, ci) => {
										const p = Math.max(0, (genUIP - ci * 0.25) / 0.5)
										return (
											<span key={c.client} className="inline-flex items-center gap-1.5 rounded-full border border-subtle px-3 py-1 text-[11px] text-secondary"
												style={{ opacity: Math.min(1, Math.max(0, p * 2)) }}>
												{c.client}<span className="text-secondary/50">→</span>
											</span>
										)
									})}
								</div>
							</div>

							{/* Chat input — fades during annotation */}
							<div className="mt-3" style={{
								opacity: Math.min(1, chatP * 4) * containerBgVis,
								transition: 'opacity 0.3s',
							}}>
								<ChatInput />
							</div>
						</div>

						{/* SVG scaffold overlay */}
						<ScaffoldOverlay
							layoutRef={layoutRef}
							heroState={heroState}
							containerWidth={containerW}
							containerHeight={containerH}
						/>

						{/* Expansion content (grows from connector nodes) */}
						<Expansions
							layoutRef={layoutRef}
							heroState={heroState}
						/>
					</div>

					{/* Scroll progress indicator */}
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
