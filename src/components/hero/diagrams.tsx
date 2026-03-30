'use client'

import { clamp01, easeOutCubic } from './scroll-phases'

// ── Shared styles ───────────────────────────────────────────────────────

const S = 'var(--primary)' // stroke
const T = 'var(--primary)' // text fill
const TS = 'var(--secondary)' // text secondary
const SW = 0.75

function Rect({
	x, y, w, h, label, dimmed, progress, dashed,
}: {
	x: number; y: number; w: number; h: number; label: string
	dimmed?: boolean; progress: number; dashed?: boolean
}) {
	const op = clamp01(progress * 3) * (dimmed ? 0.25 : 1)
	return (
		<g opacity={op}>
			<rect
				x={x} y={y} width={w} height={h} rx={3}
				fill="var(--accent)" fillOpacity={dimmed ? 0.3 : 0.5}
				stroke={dashed ? '#b08050' : S}
				strokeWidth={SW}
				strokeDasharray={dashed ? '3 2' : 'none'}
				opacity={dimmed ? 0.3 : 0.45}
			/>
			<text
				x={x + w / 2} y={y + h / 2 + 3.5}
				textAnchor="middle"
				fill={dimmed ? TS : T}
				fontSize="9" fontFamily="ui-monospace, monospace"
				opacity={dimmed ? 0.4 : 0.75}
				style={{ textDecoration: dimmed ? 'line-through' : 'none' }}
			>
				{label}
			</text>
		</g>
	)
}

function Line({
	x1, y1, x2, y2, progress, dashed, opacity: op = 0.35,
}: {
	x1: number; y1: number; x2: number; y2: number
	progress: number; dashed?: boolean; opacity?: number
}) {
	const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
	const drawP = clamp01(progress * 2.5)
	return (
		<line
			x1={x1} y1={y1} x2={x2} y2={y2}
			stroke={dashed ? '#b08050' : S}
			strokeWidth={SW}
			opacity={clamp01(progress * 3) * op}
			strokeDasharray={dashed ? '3 2' : `${len} ${len}`}
			strokeDashoffset={dashed ? 0 : len * (1 - drawP)}
		/>
	)
}

function Arrow({ x, y, progress, dir = 'right' }: {
	x: number; y: number; progress: number; dir?: 'right' | 'down'
}) {
	const op = clamp01(progress * 3) * 0.45
	const d = dir === 'right'
		? `M${x - 4} ${y - 3}L${x} ${y}L${x - 4} ${y + 3}`
		: `M${x - 3} ${y - 4}L${x} ${y}L${x + 3} ${y - 4}`
	return <path d={d} fill="none" stroke={S} strokeWidth={SW} opacity={op} />
}

function MergeNode({ cx, cy, progress }: { cx: number; cy: number; progress: number }) {
	return (
		<circle cx={cx} cy={cy} r={3}
			fill="none" stroke={S} strokeWidth={SW}
			opacity={clamp01(progress * 4) * 0.45}
		/>
	)
}

// ── Context Engineering ─────────────────────────────────────────────────
// Sources → assembled context → model
// One source discarded

export function ContextDiagram({ progress }: { progress: number }) {
	const p = easeOutCubic(progress)

	const bw = 98, bh = 22
	const sources = [
		{ label: 'system prompt', y: 4 },
		{ label: 'retrieved docs', y: 32 },
		{ label: 'memory', y: 60 },
		{ label: 'output schema', y: 88 },
	]
	const discardY = 124
	const mergeX = 132, mergeY = 49
	const asmX = 158, asmW = 108, asmY = mergeY - bh / 2
	const modelX = 290, modelW = 50, modelY = mergeY - bh / 2

	return (
		<svg viewBox="0 0 360 165" className="w-full h-auto" style={{ maxWidth: 360 }}>
			{/* Source blocks + merge lines */}
			{sources.map((s, i) => {
				const sp = clamp01(p * 3.5 - i * 0.15)
				const lp = clamp01(p * 2.5 - 0.2 - i * 0.08)
				return (
					<g key={s.label}>
						<Rect x={0} y={s.y} w={bw} h={bh} label={s.label} progress={sp} />
						<Line x1={bw} y1={s.y + bh / 2} x2={mergeX} y2={mergeY} progress={lp} />
					</g>
				)
			})}

			{/* Discarded source */}
			<Rect x={0} y={discardY} w={bw} h={bh} label="discarded ✗" dimmed progress={clamp01(p * 3 - 0.5)} />
			<Line x1={bw} y1={discardY + bh / 2} x2={bw + 18} y2={discardY + bh / 2}
				progress={clamp01(p * 2 - 0.5)} dashed opacity={0.2} />
			<text x={bw + 8} y={discardY + bh + 13}
				fontSize="8" fontFamily="ui-monospace, monospace"
				fill={TS} opacity={clamp01((p - 0.45) * 3) * 0.45}>
				low signal — excluded
			</text>

			{/* Merge node */}
			<MergeNode cx={mergeX} cy={mergeY} progress={clamp01(p - 0.25)} />

			{/* Merge → assembled context */}
			<Line x1={mergeX + 3} y1={mergeY} x2={asmX} y2={mergeY} progress={clamp01((p - 0.35) * 4)} />
			<Arrow x={asmX} y={mergeY} progress={clamp01((p - 0.38) * 4)} />
			<Rect x={asmX} y={asmY} w={asmW} h={bh} label="assembled context" progress={clamp01((p - 0.35) * 3)} />

			{/* Assembled → model */}
			<Line x1={asmX + asmW} y1={mergeY} x2={modelX} y2={mergeY} progress={clamp01((p - 0.5) * 4)} />
			<Arrow x={modelX} y={mergeY} progress={clamp01((p - 0.55) * 4)} />
			<Rect x={modelX} y={modelY} w={modelW} h={bh} label="model" progress={clamp01((p - 0.55) * 3)} />
		</svg>
	)
}

// ── System Architecture ─────────────────────────────────────────────────
// Input → 3 parallel → merge → inference → format → output
// + fallback path from validate schema

export function ArchitectureDiagram({ progress }: { progress: number }) {
	const p = easeOutCubic(progress)

	const bw = 86, bh = 22, sw = 52
	const inputX = 0, inputY = 72
	const forkX = 68
	const parX = 96
	const mergeX = 212
	const centerY = inputY + bh / 2 // 83

	const parallels = [
		{ label: 'retrieve docs', y: 14 },
		{ label: 'memory lookup', y: inputY },
		{ label: 'validate schema', y: 130 },
	]

	const seq = [
		{ label: 'merge', x: 240 },
		{ label: 'inference', x: 302 },
		{ label: 'format', x: 364 },
		{ label: 'output', x: 420 },
	]

	const barY = 174

	return (
		<svg viewBox="0 0 480 195" className="w-full h-auto" style={{ maxWidth: 480 }}>
			{/* Input */}
			<Rect x={inputX} y={inputY} w={sw} h={bh} label="input" progress={clamp01(p * 4)} />

			{/* Input → fork */}
			<Line x1={sw} y1={centerY} x2={forkX} y2={centerY} progress={clamp01(p * 3 - 0.08)} />

			{/* Parallel branches */}
			{parallels.map((br, i) => {
				const bp = clamp01(p * 3 - 0.12 - i * 0.04)
				const brCenter = br.y + bh / 2
				return (
					<g key={br.label}>
						<Line x1={forkX} y1={centerY} x2={parX} y2={brCenter} progress={clamp01(p * 3 - 0.12)} />
						<Rect x={parX} y={br.y} w={bw} h={bh} label={br.label} progress={bp} />
						<Line x1={parX + bw} y1={brCenter} x2={mergeX} y2={centerY} progress={clamp01(p * 3 - 0.35)} />
					</g>
				)
			})}

			{/* Merge node */}
			<MergeNode cx={mergeX} cy={centerY} progress={clamp01(p - 0.3)} />

			{/* Sequential nodes */}
			{seq.map((s, i) => {
				const sp = clamp01(p * 2.2 - 0.35 - i * 0.1)
				const prevRight = i === 0 ? mergeX + 3 : seq[i - 1].x + sw
				return (
					<g key={s.label}>
						<Line x1={prevRight} y1={centerY} x2={s.x} y2={centerY} progress={clamp01(p * 2.5 - 0.33 - i * 0.08)} />
						<Arrow x={s.x} y={centerY} progress={clamp01(p * 2.5 - 0.33 - i * 0.08)} />
						<Rect x={s.x} y={inputY} w={sw} h={bh} label={s.label} progress={sp} />
					</g>
				)
			})}

			{/* Fallback path (dashed, from validate schema) */}
			<Line x1={parX + bw / 2} y1={parallels[2].y + bh}
				x2={parX + bw / 2} y2={parallels[2].y + bh + 16}
				progress={clamp01((p - 0.55) * 3)} dashed />
			<g opacity={clamp01((p - 0.6) * 3)}>
				<rect x={parX - 4} y={parallels[2].y + bh + 16}
					width={bw + 8} height={bh} rx={3}
					fill="none" stroke="#b08050" strokeWidth={SW}
					strokeDasharray="3 2" opacity={0.35}
				/>
				<text x={parX + bw / 2} y={parallels[2].y + bh + 30}
					textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace"
					fill="#b08050" opacity={0.55}>
					fallback: use cache
				</text>
			</g>

			{/* Timing bars (cosmetic — illustrate parallelism) */}
			<g opacity={clamp01((p - 0.5) * 3) * 0.35}>
				{parallels.map((br, i) => (
					<rect key={br.label} x={parX} y={barY + i * 5} width={bw} height={2.5} rx={1.25}
						fill={S} opacity={0.3} />
				))}
				{seq.map((s) => (
					<rect key={s.label} x={s.x} y={barY} width={sw} height={2.5} rx={1.25}
						fill={S} opacity={0.18} />
				))}
				<text x={parX - 4} y={barY + 3} textAnchor="end"
					fontSize="7" fontFamily="ui-monospace, monospace" fill={TS} opacity={0.35}>
					t
				</text>
			</g>
		</svg>
	)
}

// ── Evaluation ──────────────────────────────────────────────────────────
// Three variant cards scored against a rubric — Variant B wins

export function EvaluationDiagram({ progress }: { progress: number }) {
	const p = easeOutCubic(progress)

	const metrics = ['accuracy', 'relevance', 'concise', 'tone']
	const variants = [
		{ label: 'Variant A', score: 72, m: [8, 7, 6, 8], win: false },
		{ label: 'Variant B', score: 91, m: [10, 9, 9, 9], win: true },
		{ label: 'Variant C', score: 68, m: [7, 8, 5, 8], win: false },
	]

	const cw = 108, ch = 136, gap = 14
	const totalW = cw * 3 + gap * 2

	return (
		<svg viewBox={`0 0 ${totalW} ${ch + 24}`} className="w-full h-auto" style={{ maxWidth: totalW }}>
			{variants.map((v, vi) => {
				const x = vi * (cw + gap)
				const cardP = clamp01(p * 3 - vi * 0.12)
				const dimFactor = v.win ? 1 : Math.max(0.3, 1 - clamp01((p - 0.55) * 3) * 0.7)
				const op = clamp01(cardP * 3) * dimFactor

				return (
					<g key={v.label} opacity={op}>
						{/* Card border */}
						<rect x={x} y={0} width={cw} height={ch} rx={4}
							fill="var(--accent)" fillOpacity={v.win && p > 0.5 ? 0.6 : 0.35}
							stroke={S} strokeWidth={v.win && p > 0.5 ? 1.25 : SW}
							opacity={v.win ? 0.5 : 0.25}
						/>

						{/* Title */}
						<text x={x + 9} y={17} fontSize="9.5" fontFamily="ui-monospace, monospace"
							fill={T} opacity={0.85}>
							{v.label}{v.win && p > 0.55 ? ' ✓' : ''}
						</text>

						{/* Overall score */}
						<text x={x + 9} y={36} fontSize="15" fontFamily="ui-monospace, monospace"
							fill={T} opacity={v.win ? 0.9 : 0.55}>
							{v.score}
						</text>

						{/* Score bar */}
						<rect x={x + 48} y={28} width={cw - 57} height={3} rx={1.5}
							fill={S} opacity={0.08} />
						<rect x={x + 48} y={28}
							width={(cw - 57) * (v.score / 100) * clamp01(cardP * 2)}
							height={3} rx={1.5}
							fill={S} opacity={v.win ? 0.4 : 0.18}
						/>

						{/* Separator */}
						<line x1={x + 9} y1={44} x2={x + cw - 9} y2={44}
							stroke={S} strokeWidth={0.5} opacity={0.12} />

						{/* Metrics */}
						{metrics.map((ml, mi) => {
							const my = 54 + mi * 21
							const mp = clamp01(cardP * 2 - 0.25 - mi * 0.08)
							return (
								<g key={ml} opacity={clamp01(mp * 3)}>
									<text x={x + 9} y={my + 10} fontSize="8"
										fontFamily="ui-monospace, monospace" fill={TS} opacity={0.65}>
										{ml}
									</text>
									<text x={x + cw - 9} y={my + 10} textAnchor="end"
										fontSize="9" fontFamily="ui-monospace, monospace"
										fill={T} opacity={0.75}>
										{v.m[mi]}/10
									</text>
									{/* Mini bar */}
									<rect x={x + 9} y={my + 14} width={cw - 18} height={2} rx={1}
										fill={S} opacity={0.06} />
									<rect x={x + 9} y={my + 14}
										width={(cw - 18) * (v.m[mi] / 10) * clamp01(mp * 2)}
										height={2} rx={1}
										fill={S} opacity={v.win ? 0.3 : 0.12}
									/>
								</g>
							)
						})}

						{/* Winner badge */}
						{v.win && p > 0.6 && (
							<text x={x + cw / 2} y={ch + 16} textAnchor="middle"
								fontSize="8" fontFamily="ui-monospace, monospace"
								fill={TS} opacity={clamp01((p - 0.6) * 4) * 0.55}>
								→ shipped to user
							</text>
						)}
					</g>
				)
			})}
		</svg>
	)
}
