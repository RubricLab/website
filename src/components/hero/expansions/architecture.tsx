'use client'

import type { ComponentBounds } from '../use-layout'
import { CONNECTOR_NODES, getNodePosition } from '../scaffold'
import { clamp01, easeOutCubic } from '../scroll-phases'

const S = 'var(--primary)'

// DAG node definitions
const NODE_W = 80
const NODE_H = 24
const H_GAP = 16
const V_SPREAD = 36 // vertical distance between parallel branches

interface DagNode {
	label: string
	x: number // relative to expansion origin
	y: number // relative to expansion origin (center of node)
}

function DagNodeBlock({ label, x, y, progress, isParallel }: {
	label: string; x: number; y: number; progress: number; isParallel?: boolean
}) {
	const op = clamp01(progress * 3)
	const scale = 0.8 + 0.2 * easeOutCubic(clamp01(progress * 2))
	return (
		<div
			className="absolute flex items-center justify-center"
			style={{
				left: x, top: y - NODE_H / 2,
				width: NODE_W, height: NODE_H,
				opacity: op,
				transform: `scale(${scale})`,
				transformOrigin: 'left center',
				border: `0.75px solid var(--primary)`,
				borderRadius: 3,
				background: 'var(--accent)',
			}}
		>
			<span className="text-[9px] font-mono text-primary" style={{
				opacity: 0.75,
				whiteSpace: 'nowrap',
			}}>
				{label}
			</span>
		</div>
	)
}

function FallbackNode({ x, y, progress }: { x: number; y: number; progress: number }) {
	const op = clamp01(progress * 3)
	return (
		<div
			className="absolute flex items-center justify-center"
			style={{
				left: x, top: y - NODE_H / 2,
				width: NODE_W + 8, height: NODE_H,
				opacity: op * 0.5,
				border: '0.75px dashed #b08050',
				borderRadius: 3,
			}}
		>
			<span className="text-[8px] font-mono" style={{ color: '#b08050', opacity: 0.7 }}>
				fallback: use cache
			</span>
		</div>
	)
}

export function ArchitectureExpansion({ bounds, progress }: {
	bounds: ComponentBounds
	progress: number
}) {
	const connectors = CONNECTOR_NODES[1]
	if (!bounds || bounds.width === 0 || connectors.length === 0) return null

	// Origin: right edge center of the reasoning component
	const origin = getNodePosition(bounds, connectors[1]) // right-center
	const startX = origin.x + 20
	const centerY = origin.y

	// Node positions
	const inputX = startX
	const parallelX = inputX + NODE_W + H_GAP + 16
	const mergeX = parallelX + NODE_W + H_GAP + 16
	const seqX = [mergeX, mergeX + NODE_W / 2 + H_GAP, mergeX + NODE_W + H_GAP * 2, mergeX + NODE_W * 1.5 + H_GAP * 3]

	const parallelNodes = [
		{ label: 'retrieve docs', y: centerY - V_SPREAD },
		{ label: 'memory lookup', y: centerY },
		{ label: 'validate schema', y: centerY + V_SPREAD },
	]

	const seqNodes = [
		{ label: 'merge', x: seqX[0] },
		{ label: 'inference', x: seqX[1] },
		{ label: 'output', x: seqX[2] },
	]

	// Timing bar position
	const barY = centerY + V_SPREAD + 50
	const barW = 70

	return (
		<>
			<svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 4 }}>
				{/* Connector from reasoning to input */}
				{(() => {
					const lineP = easeOutCubic(clamp01(progress * 5))
					const lineLen = startX - origin.x
					return (
						<line x1={origin.x} y1={origin.y} x2={startX} y2={centerY}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - lineP)}
							opacity={clamp01(lineP * 2) * 0.35}
						/>
					)
				})()}

				{/* Input to parallel fan-out */}
				{parallelNodes.map((pn, i) => {
					const lineP = easeOutCubic(clamp01((progress - 0.12) * 4))
					const dx = parallelX - (inputX + NODE_W)
					const dy = pn.y - centerY
					const lineLen = Math.sqrt(dx * dx + dy * dy)
					return (
						<line key={i}
							x1={inputX + NODE_W} y1={centerY}
							x2={parallelX} y2={pn.y}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - lineP)}
							opacity={clamp01(lineP * 2) * 0.3}
						/>
					)
				})}

				{/* Parallel to merge convergence */}
				{parallelNodes.map((pn, i) => {
					const lineP = easeOutCubic(clamp01((progress - 0.35) * 4))
					const dx = mergeX - (parallelX + NODE_W)
					const dy = centerY - pn.y
					const lineLen = Math.sqrt(dx * dx + dy * dy)
					return (
						<line key={`merge-${i}`}
							x1={parallelX + NODE_W} y1={pn.y}
							x2={mergeX} y2={centerY}
							stroke={S} strokeWidth={0.75}
							strokeDasharray={`${lineLen} ${lineLen}`}
							strokeDashoffset={lineLen * (1 - lineP)}
							opacity={clamp01(lineP * 2) * 0.3}
						/>
					)
				})}

				{/* Sequential connections (merge → inference → output) */}
				{seqNodes.slice(0, -1).map((sn, i) => {
					const lineP = easeOutCubic(clamp01((progress - 0.5 - i * 0.08) * 4))
					const x1 = sn.x + (i === 0 ? NODE_W / 2 : NODE_W)
					const x2 = seqNodes[i + 1].x
					const lineLen = x2 - x1
					return (
						<g key={`seq-${i}`}>
							<line x1={x1} y1={centerY} x2={x2} y2={centerY}
								stroke={S} strokeWidth={0.75}
								strokeDasharray={`${lineLen} ${lineLen}`}
								strokeDashoffset={lineLen * (1 - lineP)}
								opacity={clamp01(lineP * 2) * 0.3}
							/>
							<path
								d={`M${x2 - 4} ${centerY - 3} L${x2} ${centerY} L${x2 - 4} ${centerY + 3}`}
								fill="none" stroke={S} strokeWidth={0.75}
								opacity={clamp01(lineP * 2) * 0.3}
							/>
						</g>
					)
				})}

				{/* Merge circle node */}
				<circle cx={mergeX} cy={centerY} r={4}
					fill="none" stroke={S} strokeWidth={0.75}
					opacity={clamp01((progress - 0.4) * 4) * 0.4}
				/>

				{/* Fallback dashed line (from validate schema down) */}
				{progress > 0.6 && (() => {
					const fbP = easeOutCubic(clamp01((progress - 0.6) * 4))
					const fbY = centerY + V_SPREAD + NODE_H / 2
					const fbEndY = fbY + 20
					return (
						<line x1={parallelX + NODE_W / 2} y1={fbY}
							x2={parallelX + NODE_W / 2} y2={fbEndY}
							stroke="#b08050" strokeWidth={0.75}
							strokeDasharray="3 2"
							opacity={fbP * 0.3}
						/>
					)
				})()}

				{/* Timing bars (cosmetic) */}
				{progress > 0.65 && (() => {
					const tbP = clamp01((progress - 0.65) * 4)
					return (
						<g opacity={tbP * 0.3}>
							{parallelNodes.map((_, i) => (
								<rect key={i} x={parallelX} y={barY + i * 5}
									width={barW * easeOutCubic(tbP)} height={2.5} rx={1.25}
									fill={S} opacity={0.35}
								/>
							))}
							{seqNodes.map((sn, i) => (
								<rect key={`seq-bar-${i}`} x={sn.x} y={barY}
									width={(NODE_W * 0.6) * easeOutCubic(tbP)} height={2.5} rx={1.25}
									fill={S} opacity={0.2}
								/>
							))}
							<text x={parallelX - 4} y={barY + 3} textAnchor="end"
								fontSize="7" fontFamily="ui-monospace, monospace"
								fill="var(--secondary)" opacity={0.35}>
								t
							</text>
						</g>
					)
				})()}
			</svg>

			{/* HTML DAG nodes */}
			<DagNodeBlock label="input" x={inputX} y={centerY}
				progress={clamp01(progress * 5)} />

			{parallelNodes.map((pn, i) => (
				<DagNodeBlock key={pn.label} label={pn.label} x={parallelX} y={pn.y}
					progress={clamp01((progress - 0.15 - i * 0.03) * 4)} isParallel />
			))}

			{seqNodes.map((sn, i) => (
				<DagNodeBlock key={sn.label} label={sn.label} x={sn.x} y={centerY}
					progress={clamp01((progress - 0.42 - i * 0.08) * 4)} />
			))}

			{/* Fallback node */}
			{progress > 0.6 && (
				<FallbackNode
					x={parallelX - 4}
					y={centerY + V_SPREAD + NODE_H / 2 + 20 + NODE_H / 2}
					progress={clamp01((progress - 0.65) * 4)}
				/>
			)}
		</>
	)
}
