'use client'

import { useEffect, useRef, useState } from 'react'

const PIECES = [
	{
		id: 'reasoning',
		label: 'CONTEXT ENGINEERING',
		body: 'System prompts, memory architecture, primitive design. We engineer the context that makes agents intelligent, not just responsive.',
		gridCol: 0,
		gridRow: 0
	},
	{
		id: 'tools',
		label: 'ARCHITECTURE',
		body: 'Multi-agent orchestration, parallel tool execution, persistent memory, isolated infrastructure. Systems that work in production, not just in demos.',
		gridCol: 1,
		gridRow: 0
	},
	{
		id: 'generative-ui',
		label: 'GENERATIVE UI',
		body: 'Structured outputs rendered as real interfaces. Not chat bubbles with markdown. Components composed by the agent, type-safe at every boundary.',
		gridCol: 0,
		gridRow: 1
	},
	{
		id: 'memory',
		label: 'FINE-TUNING & RL',
		body: 'Synthetic data generation, preference training, domain-specific evaluation. We shape the model, not just the prompt.',
		gridCol: 1,
		gridRow: 1
	}
]

const EXPLODE_OFFSETS: Record<string, { x: number; y: number; rY: number; rX: number }> = {
	reasoning: { x: -300, y: -180, rY: -6, rX: 4 },
	tools: { x: 300, y: -180, rY: 6, rX: 4 },
	'generative-ui': { x: -300, y: 180, rY: -6, rX: -4 },
	memory: { x: 300, y: 180, rY: 6, rX: -4 }
}

// Easing functions
function easeOutQuad(t: number) { return 1 - (1 - t) * (1 - t) }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }

export function ExplodedView() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const section = sectionRef.current
		if (!section) return

		const handleScroll = () => {
			const rect = section.getBoundingClientRect()
			const vh = window.innerHeight
			// Progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
			const scrollable = section.offsetHeight - vh
			if (scrollable <= 0) return
			const scrolled = -rect.top
			const p = Math.max(0, Math.min(1, scrolled / scrollable))
			setProgress(p)
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Phase calculations
	const chatFade = Math.min(1, progress / 0.10)
	const outlineIn = Math.min(1, progress / 0.08)
	const separation = Math.max(0, Math.min(1, (progress - 0.10) / 0.35))
	const settlement = Math.max(0, Math.min(1, (progress - 0.45) / 0.30))
	const cardReveal = Math.max(0, Math.min(1, (progress - 0.78) / 0.22))

	const guideOpacity = separation > 0
		? Math.min(0.6, separation * 0.6) * Math.max(0, 1 - settlement * 1.5)
		: 0

	const easedSep = easeOutQuad(separation)
	const easedSettle = easeInOutCubic(settlement)

	// Grid dimensions
	const gridGap = 16
	const cardW = 288
	const cardH = 180
	const gridW = cardW * 2 + gridGap
	const gridH = cardH * 2 + gridGap

	const getGridPos = (col: number, row: number) => ({
		x: col * (cardW + gridGap) - gridW / 2 + cardW / 2,
		y: row * (cardH + gridGap) - gridH / 2 + cardH / 2
	})

	return (
		<>
		{/* Mobile: simple capability cards */}
		<section className="md:hidden max-w-[1200px] mx-auto px-6 py-16">
			<div className="grid grid-cols-1 gap-4">
				{PIECES.map((piece) => (
					<div key={piece.id} className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6">
						<h3 className="font-mono text-xs text-[#555555] tracking-widest uppercase mb-3">{piece.label}</h3>
						<p className="font-sans text-sm text-[#888888] leading-relaxed">{piece.body}</p>
					</div>
				))}
			</div>
		</section>

		{/* Desktop: scroll-driven explosion */}
		<section ref={sectionRef} className="relative hidden md:block" style={{ height: '300vh' }}>
			<div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
				{/* Chat ghost */}
				<div
					className="absolute"
					style={{
						opacity: Math.max(0, 1 - chatFade * 2),
						transform: `scale(${1 - chatFade * 0.3})`,
						pointerEvents: 'none'
					}}
				>
					<div className="bg-[#111111] border border-[#1A1A1A] rounded-lg w-[460px] h-[340px] flex flex-col items-center justify-center gap-2">
						<span className="font-mono text-[10px] text-[#555555] tracking-widest uppercase">
							Rubric Assistant
						</span>
						<span className="relative flex h-[6px] w-[6px]">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-50" />
							<span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#4ADE80]" />
						</span>
					</div>
				</div>

				{/* Guide lines */}
				{guideOpacity > 0 && (
					<svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
						{PIECES.map((piece) => {
							const off = EXPLODE_OFFSETS[piece.id]
							const grid = getGridPos(piece.gridCol, piece.gridRow)
							const ex = off.x * easedSep
							const ey = off.y * easedSep
							const cx = ex + (grid.x - ex) * easedSettle
							const cy = ey + (grid.y - ey) * easedSettle
							return (
								<line
									key={piece.id}
									x1="50%" y1="50%"
									x2={`calc(50% + ${cx}px)`}
									y2={`calc(50% + ${cy}px)`}
									stroke="#444444"
									strokeWidth="1"
									strokeDasharray="4 4"
									opacity={guideOpacity}
								/>
							)
						})}
						<circle cx="50%" cy="50%" r="2.5" fill="#555555" />
					</svg>
				)}

				{/* Exploding pieces */}
				{PIECES.map((piece) => {
					const off = EXPLODE_OFFSETS[piece.id]
					const grid = getGridPos(piece.gridCol, piece.gridRow)
					const ex = off.x * easedSep
					const ey = off.y * easedSep
					const cx = ex + (grid.x - ex) * easedSettle
					const cy = ey + (grid.y - ey) * easedSettle
					const rotY = off.rY * easedSep * (1 - easedSettle)
					const rotX = off.rX * easedSep * (1 - easedSettle)
					const w = 140 + (cardW - 140) * easedSettle
					const h = 70 + (cardH - 70) * easedSettle
					const opacity = outlineIn * (1 - cardReveal)
					const isDashed = easedSettle < 0.4
					const bgAlpha = isDashed ? 0.15 : easedSettle * 0.9

					return (
						<div
							key={piece.id}
							className="absolute"
							style={{
								left: '50%',
								top: '50%',
								width: w,
								height: h,
								marginLeft: -w / 2,
								marginTop: -h / 2,
								opacity,
								transform: `translate(${cx}px, ${cy}px) perspective(800px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
								border: `1px ${isDashed ? 'dashed' : 'solid'} ${isDashed ? '#666666' : '#2A2A2A'}`,
								borderRadius: easedSettle > 0.3 ? '8px' : '3px',
								backgroundColor: `rgba(17, 17, 17, ${bgAlpha})`,
								zIndex: 2,
								pointerEvents: 'none'
							}}
						>
							{/* Label */}
							<div
								className="absolute font-mono tracking-[0.1em] uppercase whitespace-nowrap"
								style={{
									fontSize: isDashed ? 10 : 11,
									color: isDashed ? '#777777' : '#555555',
									top: isDashed ? -18 : 20,
									left: isDashed ? 0 : 24,
								}}
							>
								{piece.label}
							</div>

							{/* Body text */}
							{easedSettle > 0.4 && (
								<p
									className="absolute left-6 right-6 font-sans text-[#888888] leading-relaxed"
									style={{
										top: 48,
										fontSize: 13 + easedSettle,
										opacity: Math.min(1, (easedSettle - 0.4) / 0.3),
									}}
								>
									{piece.body}
								</p>
							)}

							{/* Corner markers */}
							{isDashed && (
								<>
									<span className="absolute -top-px -left-px w-[8px] h-[8px] border-t border-l border-[#777777]" />
									<span className="absolute -top-px -right-px w-[8px] h-[8px] border-t border-r border-[#777777]" />
									<span className="absolute -bottom-px -left-px w-[8px] h-[8px] border-b border-l border-[#777777]" />
									<span className="absolute -bottom-px -right-px w-[8px] h-[8px] border-b border-r border-[#777777]" />
								</>
							)}
						</div>
					)
				})}

				{/* Final cards */}
				{cardReveal > 0 && (
					<div
						className="absolute"
						style={{
							opacity: cardReveal,
							transform: `translateY(${(1 - cardReveal) * 12}px)`,
							zIndex: 3
						}}
					>
						<div className="grid grid-cols-2 gap-4" style={{ width: gridW }}>
							{PIECES.map((piece) => (
								<div
									key={piece.id}
									className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-8 hover:border-[#2A2A2A] transition-colors duration-200"
									style={{ minHeight: cardH }}
								>
									<h3 className="font-mono text-xs text-[#555555] tracking-widest uppercase mb-4">
										{piece.label}
									</h3>
									<p className="font-sans text-[15px] text-[#888888] leading-relaxed">
										{piece.body}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Progress bar */}
				{progress > 0.02 && progress < 0.98 && (
					<div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 4 }}>
						<div className="w-[60px] h-[2px] bg-[#1A1A1A] rounded-full overflow-hidden">
							<div className="h-full bg-[#444444] rounded-full" style={{ width: `${progress * 100}%` }} />
						</div>
					</div>
				)}
			</div>
		</section>
		</>
	)
}
