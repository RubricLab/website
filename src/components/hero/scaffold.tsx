'use client'

import type { ComponentBounds, LayoutRef } from './use-layout'
import type { HeroState } from './scroll-phases'
import { clamp01 } from './scroll-phases'

// ── Types ────────────────────────────────────────────────────────────────

/** Connector node definition: position relative to component bounds */
export interface ConnectorNode {
	/** Unique ID for this node */
	id: string
	/** Position relative to component: 0=left/top, 1=right/bottom */
	xRatio: number
	yRatio: number
	/** Which edge: used for expansion direction */
	edge: 'top' | 'bottom' | 'left' | 'right'
}

// Per-component connector node definitions
export const CONNECTOR_NODES: ConnectorNode[][] = [
	// /01 question: 3 nodes on bottom edge (for context branching down)
	[
		{ id: 'q-bl', xRatio: 0.25, yRatio: 1, edge: 'bottom' },
		{ id: 'q-bc', xRatio: 0.5,  yRatio: 1, edge: 'bottom' },
		{ id: 'q-br', xRatio: 0.75, yRatio: 1, edge: 'bottom' },
	],
	// /02 reasoning: 3 nodes on right edge (for architecture fanning right)
	[
		{ id: 'r-rt', xRatio: 1, yRatio: 0.25, edge: 'right' },
		{ id: 'r-rc', xRatio: 1, yRatio: 0.5,  edge: 'right' },
		{ id: 'r-rb', xRatio: 1, yRatio: 0.75, edge: 'right' },
	],
	// /03 response: 1 node on right edge (for evaluation extending right)
	[
		{ id: 's-rc', xRatio: 1, yRatio: 0.5, edge: 'right' },
	],
	// /04 citations: no connector nodes
	[],
]

const S = 'var(--primary)'
const CORNER_SIZE = 8
const GUIDE_EXTEND = 50

// ── Helper: get absolute position of a connector node ────────────────────

export function getNodePosition(
	bounds: ComponentBounds,
	node: ConnectorNode
): { x: number; y: number } {
	return {
		x: bounds.left + bounds.width * node.xRatio,
		y: bounds.top + bounds.height * node.yRatio,
	}
}

// ── Per-component scaffold ───────────────────────────────────────────────

function ComponentScaffold({
	bounds, index, drawProgress, ghostProgress, isFocused,
}: {
	bounds: ComponentBounds
	index: number
	drawProgress: number
	ghostProgress: number
	isFocused: boolean
}) {
	const { top: y, left: x, width: w, height: h } = bounds
	if (w === 0 || h === 0) return null

	const connectors = CONNECTOR_NODES[index]
	const perimeter = 2 * (w + h)
	const dashOffset = perimeter * (1 - drawProgress)
	const mainOp = clamp01(drawProgress * 1.5)

	// Ghost guide lines (dashed, very faint)
	const ghostOp = ghostProgress * 0.06

	return (
		<g>
			{/* Ghost dashed guide lines (visible when component is in ghost state) */}
			{ghostProgress > 0.01 && (
				<>
					<rect
						x={x} y={y} width={w} height={h} rx={4}
						fill="none" stroke={S} strokeWidth={0.75}
						strokeDasharray="4 3"
						opacity={ghostOp}
					/>
					{/* Horizontal ghost guides */}
					<line x1={x - GUIDE_EXTEND * 0.4} y1={y} x2={x} y2={y}
						stroke={S} strokeWidth={0.5} strokeDasharray="3 3" opacity={ghostOp * 0.7} />
					<line x1={x + w} y1={y + h} x2={x + w + GUIDE_EXTEND * 0.4} y2={y + h}
						stroke={S} strokeWidth={0.5} strokeDasharray="3 3" opacity={ghostOp * 0.7} />
				</>
			)}

			{/* Main scaffold (visible when drawing/drawn) */}
			{drawProgress > 0.01 && (
				<>
					{/* Border rect */}
					<rect
						x={x} y={y} width={w} height={h} rx={4}
						fill="none" stroke={S} strokeWidth={0.75}
						strokeDasharray={`${perimeter} ${perimeter}`}
						strokeDashoffset={dashOffset}
						opacity={mainOp * 0.4}
					/>

					{/* Corner L-marks */}
					{[
						// Top-left
						`M${x} ${y + CORNER_SIZE} L${x} ${y} L${x + CORNER_SIZE} ${y}`,
						// Top-right
						`M${x + w - CORNER_SIZE} ${y} L${x + w} ${y} L${x + w} ${y + CORNER_SIZE}`,
						// Bottom-right
						`M${x + w} ${y + h - CORNER_SIZE} L${x + w} ${y + h} L${x + w - CORNER_SIZE} ${y + h}`,
						// Bottom-left
						`M${x + CORNER_SIZE} ${y + h} L${x} ${y + h} L${x} ${y + h - CORNER_SIZE}`,
					].map((d, i) => {
						const cornerLen = CORNER_SIZE * 2
						return (
							<path key={i} d={d}
								fill="none" stroke={S} strokeWidth={0.75}
								strokeDasharray={`${cornerLen} ${cornerLen}`}
								strokeDashoffset={cornerLen * (1 - drawProgress)}
								opacity={mainOp * 0.55}
							/>
						)
					})}

					{/* Guide lines extending beyond bounds */}
					{/* Left guide from top */}
					<line x1={x - GUIDE_EXTEND} y1={y} x2={x} y2={y}
						stroke={S} strokeWidth={0.5}
						strokeDasharray={`${GUIDE_EXTEND} ${GUIDE_EXTEND}`}
						strokeDashoffset={GUIDE_EXTEND * (1 - drawProgress)}
						opacity={mainOp * 0.2}
					/>
					{/* Right guide from bottom */}
					<line x1={x + w} y1={y + h} x2={x + w + GUIDE_EXTEND} y2={y + h}
						stroke={S} strokeWidth={0.5}
						strokeDasharray={`${GUIDE_EXTEND} ${GUIDE_EXTEND}`}
						strokeDashoffset={GUIDE_EXTEND * (1 - drawProgress)}
						opacity={mainOp * 0.2}
					/>
					{/* Top vertical guide */}
					<line x1={x} y1={y - GUIDE_EXTEND} x2={x} y2={y}
						stroke={S} strokeWidth={0.5}
						strokeDasharray={`${GUIDE_EXTEND} ${GUIDE_EXTEND}`}
						strokeDashoffset={GUIDE_EXTEND * (1 - drawProgress)}
						opacity={mainOp * 0.15}
					/>
					{/* Bottom vertical guide */}
					<line x1={x + w} y1={y + h} x2={x + w} y2={y + h + GUIDE_EXTEND}
						stroke={S} strokeWidth={0.5}
						strokeDasharray={`${GUIDE_EXTEND} ${GUIDE_EXTEND}`}
						strokeDashoffset={GUIDE_EXTEND * (1 - drawProgress)}
						opacity={mainOp * 0.15}
					/>

					{/* Index label */}
					<text
						x={x - 4} y={y - 8}
						fontSize="9" fontFamily="ui-monospace, monospace"
						fill={S}
						opacity={mainOp * 0.5}
					>
						/{String(index + 1).padStart(2, '0')}
					</text>

					{/* Connector nodes */}
					{connectors!.map(node => {
						const nx = bounds.left + bounds.width * node.xRatio
						const ny = bounds.top + bounds.height * node.yRatio
						const nodeOp = mainOp * (isFocused ? 0.7 : 0.35)
						return (
							<g key={node.id}>
								<circle cx={nx} cy={ny} r={3}
									fill="none" stroke={S} strokeWidth={0.75}
									opacity={nodeOp}
								/>
								{/* Pulse ring when focused */}
								{isFocused && (
									<circle cx={nx} cy={ny} r={6}
										fill="none" stroke={S} strokeWidth={0.5}
										opacity={nodeOp * 0.3}
									/>
								)}
							</g>
						)
					})}
				</>
			)}
		</g>
	)
}

// ── Main scaffold overlay ────────────────────────────────────────────────

export function ScaffoldOverlay({
	layoutRef, heroState, containerWidth, containerHeight,
}: {
	layoutRef: LayoutRef
	heroState: HeroState
	containerWidth: number
	containerHeight: number
}) {
	const layout = layoutRef.current
	if (!layout || layout.length < 4) return null

	// Check if any scaffold is visible
	const hasVisibleScaffold = heroState.scaffoldDraw.some(d => d > 0.01) ||
		heroState.ghostGuides.some(g => g > 0.01)
	if (!hasVisibleScaffold) return null

	return (
		<svg
			className="absolute inset-0 pointer-events-none"
			style={{
				width: containerWidth,
				height: containerHeight,
				overflow: 'visible',
				zIndex: 5,
			}}
		>
			{layout.map((bounds, i) => (
				<ComponentScaffold
					key={i}
					bounds={bounds}
					index={i}
					drawProgress={heroState.scaffoldDraw[i]!}
					ghostProgress={heroState.ghostGuides[i]!}
					isFocused={heroState.components[i] === 'focused'}
				/>
			))}
		</svg>
	)
}
