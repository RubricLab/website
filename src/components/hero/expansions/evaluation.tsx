'use client'

import type { ComponentBounds } from '../use-layout'
import { CONNECTOR_NODES, getNodePosition } from '../scaffold'
import { clamp01, easeOutCubic, easeOut } from '../scroll-phases'

const S = 'var(--primary)'

const ITERATIONS = [
	{
		label: 'iteration 1',
		text: 'We do research and then build for clients. Our approach combines AI expertise with production experience...',
		score: 60,
		metrics: { accuracy: 6, relevance: 7, concision: 5 },
	},
	{
		label: 'iteration 2',
		text: "We're a research lab and product studio. We publish research, then ship those patterns as production systems...",
		score: 77,
		metrics: { accuracy: 8, relevance: 8, concision: 7 },
	},
	{
		label: 'iteration 3',
		text: "We're a research lab and a product studio. We publish research on agent architectures, then ship those patterns as production systems. Same team does both — no handoff, no translation layer.",
		score: 91,
		metrics: { accuracy: 9, relevance: 9, concision: 9 },
		winner: true,
	},
]

const CARD_W = 140
const CARD_H = 150
const CARD_GAP = 8

function IterationCard({ iter, x, y, progress, compressed }: {
	iter: typeof ITERATIONS[0]
	x: number; y: number
	progress: number
	compressed: number // 0 = full, 1 = compressed to line
}) {
	const op = clamp01(progress * 3)
	const h = CARD_H * (1 - compressed * 0.97) // compress to ~3px
	const textOp = 1 - compressed

	if (op < 0.01) return null

	return (
		<div
			className="absolute"
			style={{
				left: x, top: y,
				width: CARD_W, height: h,
				opacity: op * (compressed > 0.8 ? 0.08 : 1), // ghost opacity when compressed
				transition: 'none',
				overflow: 'hidden',
			}}
		>
			<div
				className="h-full rounded px-3 py-2.5"
				style={{
					border: `${iter.winner ? 1.25 : 0.75}px solid var(--primary)`,
					opacity: iter.winner ? 0.5 : 0.3,
					background: 'var(--accent)',
				}}
			>
				{textOp > 0.01 && (
					<div style={{ opacity: textOp }}>
						{/* Label */}
						<p className="text-[9px] font-mono text-secondary" style={{ opacity: 0.6 }}>
							{iter.label}{iter.winner ? ' ✓' : ''}
						</p>

						{/* Score */}
						<p className="text-[16px] font-mono text-primary mt-1" style={{
							opacity: iter.winner ? 0.85 : 0.5,
						}}>
							{iter.score}
						</p>

						{/* Score bar */}
						<div className="mt-1 h-[2px] rounded-full" style={{
							background: 'var(--primary)', opacity: 0.06,
						}}>
							<div className="h-full rounded-full" style={{
								background: 'var(--primary)',
								opacity: iter.winner ? 0.4 : 0.15,
								width: `${iter.score}%`,
							}} />
						</div>

						{/* Separator */}
						<div className="h-px mt-2 mb-2" style={{ background: 'var(--primary)', opacity: 0.08 }} />

						{/* Metrics */}
						{Object.entries(iter.metrics).map(([key, val]) => (
							<div key={key} className="flex justify-between items-center mt-1.5">
								<span className="text-[8px] font-mono text-secondary" style={{ opacity: 0.6 }}>
									{key}
								</span>
								<span className="text-[9px] font-mono text-primary" style={{ opacity: 0.7 }}>
									{val}/10
								</span>
							</div>
						))}

						{/* Mini metric bars */}
						{Object.entries(iter.metrics).map(([key, val]) => (
							<div key={`bar-${key}`} className="mt-0.5 h-[1.5px] rounded-full" style={{
								background: 'var(--primary)', opacity: 0.04,
							}}>
								<div className="h-full rounded-full" style={{
									background: 'var(--primary)',
									opacity: iter.winner ? 0.3 : 0.1,
									width: `${val * 10}%`,
								}} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export function EvaluationExpansion({ bounds, progress }: {
	bounds: ComponentBounds
	progress: number
}) {
	const connectors = CONNECTOR_NODES[2]
	if (!bounds || bounds.width === 0 || connectors.length === 0) return null

	const origin = getNodePosition(bounds, connectors[0]) // right-center
	const startX = origin.x + 24
	const centerY = origin.y - CARD_H / 2

	// Phase within evaluation: show iterations sequentially, tiling right
	// 0.0-0.25: iter 1 appears at startX
	// 0.25-0.50: iter 2 appears next to iter 1
	// 0.50-0.75: iter 3 appears next to iter 2
	// 0.75-0.90: scores settle, winner highlighted
	// 0.90-1.0: iters 1&2 compress to ghost lines, iter 3 stays

	const iter1Appear = clamp01(progress * 4)
	const iter2Appear = clamp01((progress - 0.25) * 4)
	const iter3Appear = clamp01((progress - 0.50) * 4)
	const compressP = clamp01((progress - 0.88) * 8)

	// Tile left-to-right from startX
	const iter1X = startX
	const iter2X = startX + CARD_W + CARD_GAP
	const iter3X = startX + (CARD_W + CARD_GAP) * 2

	return (
		<>
			<svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 4 }}>
				{/* Connector from response to expansion */}
				{(() => {
					const lineP = easeOutCubic(clamp01(progress * 5))
					const lineLen = startX - origin.x
					return (
						<line x1={origin.x} y1={origin.y} x2={startX} y2={origin.y}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - lineP)}
							opacity={clamp01(lineP * 2) * 0.35}
						/>
					)
				})()}

				{/* Feedback arrow at bottom */}
				{progress > 0.6 && (() => {
					const fbP = easeOutCubic(clamp01((progress - 0.6) * 3))
					const arrowY = centerY + CARD_H + 16
					const arrowX1 = iter1X + CARD_W / 2
					const arrowX2 = iter3X + CARD_W / 2
					const arrowW = Math.abs(arrowX2 - arrowX1)
					return (
						<g opacity={fbP * 0.3}>
							{/* Bottom line */}
							<line x1={arrowX1} y1={arrowY} x2={arrowX2} y2={arrowY}
								stroke={S} strokeWidth={0.75}
								strokeDasharray={`${arrowW} ${arrowW}`}
								strokeDashoffset={arrowW * (1 - fbP)}
							/>
							{/* Vertical ticks at each iteration */}
							{[arrowX1, (arrowX1 + arrowX2) / 2, arrowX2].map((ax, i) => (
								<line key={i} x1={ax} y1={arrowY - 3} x2={ax} y2={arrowY + 3}
									stroke={S} strokeWidth={0.5} opacity={0.5}
								/>
							))}
							{/* Label */}
							<text x={(arrowX1 + arrowX2) / 2} y={arrowY + 14}
								textAnchor="middle" fontSize="7"
								fontFamily="ui-monospace, monospace"
								fill="var(--secondary)" opacity={0.5}>
								scores feed back into next run
							</text>
						</g>
					)
				})()}
			</svg>

			{/* Iteration cards */}
			<IterationCard
				iter={ITERATIONS[0]}
				x={iter1X} y={centerY}
				progress={iter1Appear}
				compressed={compressP}
			/>
			<IterationCard
				iter={ITERATIONS[1]}
				x={iter2X} y={centerY}
				progress={iter2Appear}
				compressed={compressP}
			/>
			<IterationCard
				iter={ITERATIONS[2]}
				x={iter3X} y={centerY}
				progress={iter3Appear}
				compressed={0}
			/>
		</>
	)
}
