'use client'

import type { ComponentBounds } from '../use-layout'
import { CONNECTOR_NODES, getNodePosition } from '../scaffold'
import { clamp01, easeOutCubic } from '../scroll-phases'

const S = 'var(--primary)'

const SOURCES = [
	{ label: 'system prompt', detail: 'role: rubric agent', detail2: 'max: 2 lines', node: 0 },
	{ label: 'retrieved', detail: 'safeway case study', detail2: 'rel: 0.91', node: 1 },
	{ label: 'memory', detail: 'visitor: eng. leader', detail2: '', node: 2 },
]
const SCHEMA = { label: 'schema', detail: '2 sentences', detail2: '+ citations' }
const DISCARDED = { label: 'discarded ✗', detail: 'gumloop case study', detail2: 'rel: 0.64 — low signal' }

const BLOCK_W = 140
const BLOCK_H = 64
const BLOCK_GAP = 16
const DROP_Y = 40  // vertical distance from connector to first row

function SourceBlock({ x, y, label, detail, detail2, progress, discarded }: {
	x: number; y: number; label: string; detail: string; detail2: string
	progress: number; discarded?: boolean
}) {
	const op = clamp01(progress * 3)
	const scale = 0.7 + 0.3 * easeOutCubic(clamp01(progress * 2))
	return (
		<div
			className="absolute"
			style={{
				left: x, top: y,
				width: BLOCK_W, height: BLOCK_H,
				opacity: op,
				transform: `scale(${scale})`,
				transformOrigin: 'top center',
			}}
		>
			<div
				className="h-full rounded px-3 py-2.5"
				style={{
					border: `0.75px ${discarded ? 'dashed' : 'solid'} ${discarded ? '#b08050' : 'var(--primary)'}`,
					borderColor: discarded ? '#b08050' : undefined,
					opacity: discarded ? 0.5 : 0.35,
					background: 'var(--accent)',
				}}
			>
				<p className="text-[9px] font-mono text-primary leading-tight" style={{
					opacity: 0.8,
					textDecoration: discarded ? 'line-through' : 'none',
				}}>
					{label}
				</p>
				<p className="text-[8px] font-mono text-secondary leading-tight mt-1" style={{ opacity: 0.6 }}>
					{detail}
				</p>
				{detail2 && (
					<p className="text-[8px] font-mono text-secondary leading-tight" style={{ opacity: 0.45 }}>
						{detail2}
					</p>
				)}
			</div>
		</div>
	)
}

export function ContextExpansion({ bounds, progress }: {
	bounds: ComponentBounds
	progress: number
}) {
	const connectors = CONNECTOR_NODES[0]
	if (!bounds || bounds.width === 0) return null

	// Source block positions (centered under each connector node)
	const nodePositions = connectors.map(n => getNodePosition(bounds, n))
	const blockY = bounds.top + bounds.height + DROP_Y

	// Schema below first source
	const schemaY = blockY + BLOCK_H + BLOCK_GAP
	const schemaX = nodePositions[0].x - BLOCK_W / 2

	// Discarded below schema
	const discardedY = schemaY + BLOCK_H + BLOCK_GAP

	return (
		<>
			{/* SVG connector lines (rendered in the expansion SVG layer) */}
			<svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 4 }}>
				{/* Vertical lines from connector nodes down to source blocks */}
				{nodePositions.map((pos, i) => {
					const lineP = clamp01((progress - i * 0.06) * 4)
					const lineLen = DROP_Y
					return (
						<line key={i}
							x1={pos.x} y1={pos.y}
							x2={pos.x} y2={pos.y + lineLen}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - easeOutCubic(lineP))}
							opacity={clamp01(lineP * 2) * 0.35}
						/>
					)
				})}

				{/* Vertical line from first source down to schema */}
				{progress > 0.4 && (() => {
					const lineP = clamp01((progress - 0.4) * 4)
					const startY = blockY + BLOCK_H
					const endY = schemaY
					const lineLen = endY - startY
					return (
						<line
							x1={nodePositions[0].x} y1={startY}
							x2={nodePositions[0].x} y2={endY}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - easeOutCubic(lineP))}
							opacity={clamp01(lineP * 2) * 0.3}
						/>
					)
				})()}

				{/* Arrow heads at block entries */}
				{nodePositions.map((pos, i) => {
					const arrowP = clamp01((progress - 0.1 - i * 0.06) * 4)
					return (
						<path key={`arrow-${i}`}
							d={`M${pos.x - 3} ${pos.y + DROP_Y - 5} L${pos.x} ${pos.y + DROP_Y} L${pos.x + 3} ${pos.y + DROP_Y - 5}`}
							fill="none" stroke={S} strokeWidth={0.75}
							opacity={clamp01(arrowP * 3) * 0.3}
						/>
					)
				})}
			</svg>

			{/* HTML source blocks */}
			{SOURCES.map((src, i) => (
				<SourceBlock
					key={src.label}
					x={nodePositions[i].x - BLOCK_W / 2}
					y={blockY}
					label={src.label}
					detail={src.detail}
					detail2={src.detail2}
					progress={clamp01((progress - 0.1 - i * 0.06) * 3)}
				/>
			))}

			{/* Schema block */}
			<SourceBlock
				x={schemaX}
				y={schemaY}
				label={SCHEMA.label}
				detail={SCHEMA.detail}
				detail2={SCHEMA.detail2}
				progress={clamp01((progress - 0.45) * 3)}
			/>

			{/* Discarded block */}
			<SourceBlock
				x={schemaX}
				y={discardedY}
				label={DISCARDED.label}
				detail={DISCARDED.detail}
				detail2={DISCARDED.detail2}
				progress={clamp01((progress - 0.6) * 3)}
				discarded
			/>
		</>
	)
}
