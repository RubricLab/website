'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BLOCK_COLORS, FIGURE_CONTAINER_CLASS } from '~/ui/blog/figure-palette'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const AMBER = BLOCK_COLORS.amber

/**
 * OpenClaw fleet animation. Loops continuously while in view.
 *
 * Beats:
 *   1. Client 0 pings their OpenClaw (packet: Client 0 → OpenClaw 0)
 *   2. OpenClaw 0 updates its internal state (OC0 stays lit)
 *   3. Admin Slacks the supervisor (packet: Admin → Supervisor)
 *   4. Supervisor patches the harness (supervisor pulses)
 *   5. Patch reloads OpenClaw 0 (packet: Supervisor → OpenClaw 0)
 *   6. OpenClaw 0 picks up the patch (OC0 pulses)
 */

type PhaseId =
	| 'idle'
	| 'admin-ping'
	| 'sup-patch'
	| 'sup-push'
	| 'oc-rebuild'
	| 'pause'
	| 'client-ping'
	| 'oc-state'
	| 'done'

type Phase = { caption: string; id: PhaseId; ms: number }

const PHASES: Phase[] = [
	{ caption: '', id: 'idle', ms: 600 },
	{ caption: 'Client 0 pings their OpenClaw', id: 'client-ping', ms: 1500 },
	{ caption: 'OpenClaw 0 updates its state', id: 'oc-state', ms: 1500 },
	{ caption: '', id: 'pause', ms: 600 },
	{ caption: 'Admin Slacks the supervisor', id: 'admin-ping', ms: 1500 },
	{ caption: 'Supervisor patches the harness', id: 'sup-patch', ms: 1800 },
	{ caption: 'Patch reloads OpenClaw 0', id: 'sup-push', ms: 1500 },
	{ caption: 'OpenClaw 0 picks up the patch', id: 'oc-rebuild', ms: 1000 },
	{ caption: '', id: 'done', ms: 900 }
]

const TOTAL_MS = PHASES.reduce((sum, p) => sum + p.ms, 0)

const VB_W = 700
const VB_H = 340

type Box = { h: number; w: number; x: number; y: number }

const ADMIN: Box = { h: 42, w: 98, x: 14, y: 46 }
const SANDBOX: Box = { h: 240, w: 420, x: 140, y: 24 }
const SUP: Box = { h: 42, w: 304, x: 200, y: 46 }

const ocBox = (x: number): Box => ({ h: 40, w: 84, x, y: 160 })
const OC0 = ocBox(188)
const OC1 = ocBox(296)
const OCN = ocBox(446)

const clBox = (x: number): Box => ({ h: 40, w: 84, x, y: 288 })
const CL0 = clBox(188)
const CL1 = clBox(296)
const CLN = clBox(446)

const SB_LEGEND: Box = { h: 36, w: 88, x: 596, y: 46 }

type Pt = { x: number; y: number }

const NODE_RADIUS = 6
const PATCH_GLOW_OUTSET = 3

const adminRight: Pt = { x: ADMIN.x + ADMIN.w, y: ADMIN.y + ADMIN.h / 2 }
const supLeft: Pt = { x: SUP.x, y: SUP.y + SUP.h / 2 }
const supBottom: Pt = { x: OC0.x + OC0.w / 2, y: SUP.y + SUP.h }
const oc0Top: Pt = { x: OC0.x + OC0.w / 2, y: OC0.y }
const oc0Bottom: Pt = { x: OC0.x + OC0.w / 2, y: OC0.y + OC0.h }
const cl0Top: Pt = { x: CL0.x + CL0.w / 2, y: CL0.y }

const lerp = (a: Pt, b: Pt, t: number): Pt => ({
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t
})

const phaseInfo = (elapsed: number): { id: PhaseId; t: number } => {
	let acc = 0
	for (const p of PHASES) {
		if (elapsed < acc + p.ms) {
			return { id: p.id, t: (elapsed - acc) / p.ms }
		}
		acc += p.ms
	}
	const last = PHASES[PHASES.length - 1] as Phase
	return { id: last.id, t: 1 }
}

// Returns the most recent non-empty caption at this point in the timeline,
// so meaningful descriptions persist through brief idle/pause beats.
const stickyCaption = (elapsed: number): string => {
	let acc = 0
	let last = ''
	for (const p of PHASES) {
		if (elapsed >= acc && p.caption) last = p.caption
		if (elapsed < acc + p.ms) return last
		acc += p.ms
	}
	return last
}

type NodeEmphasis = 'patch' | undefined

const NodeBox = ({
	active,
	box,
	emphasis,
	label,
	tint
}: {
	active?: boolean
	box: Box
	emphasis?: NodeEmphasis
	label: string
	tint?: boolean
}) => {
	// Tinted nodes (OpenClaws, Sandbox legend) borrow the shared amber
	// palette so the figure reads the same way as other blog figures.
	const colorClass = tint ? AMBER.text : 'text-primary'
	const baseOpacity = tint ? 0.7 : 0.5
	const activeOpacity = tint ? 1 : 0.9
	return (
		<g className={colorClass}>
			{emphasis === 'patch' && (
				<rect
					x={box.x - PATCH_GLOW_OUTSET}
					y={box.y - PATCH_GLOW_OUTSET}
					width={box.w + PATCH_GLOW_OUTSET * 2}
					height={box.h + PATCH_GLOW_OUTSET * 2}
					rx={NODE_RADIUS + PATCH_GLOW_OUTSET}
					fill="currentColor"
					className="animate-pulse"
					style={{ opacity: 0.12 }}
				/>
			)}
			<rect
				x={box.x}
				y={box.y}
				width={box.w}
				height={box.h}
				rx={NODE_RADIUS}
				className={tint ? 'fill-amber-500/15' : 'fill-transparent'}
				stroke="currentColor"
				strokeWidth={active ? 1.6 : 1}
				style={{
					opacity: active ? activeOpacity : baseOpacity,
					transition: 'opacity 700ms ease-in-out, stroke-width 700ms ease-in-out'
				}}
			/>
			<text
				x={box.x + box.w / 2}
				y={box.y + box.h / 2 + 4}
				textAnchor="middle"
				fill="currentColor"
				className="font-medium font-sans"
				fontSize={11}
				style={{
					opacity: active ? 1 : 0.85,
					transition: 'opacity 700ms ease-in-out'
				}}
			>
				{label}
			</text>
		</g>
	)
}

const Packet = ({ at }: { at: Pt | null }) => {
	if (!at) return null
	return (
		<g>
			<circle cx={at.x} cy={at.y} r={8} fill="currentColor" style={{ opacity: 0.22 }} />
			<circle cx={at.x} cy={at.y} r={3.5} fill="currentColor" />
		</g>
	)
}

export const OpenclawSystemFigure = () => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const hasAutoPlayed = useRef(false)
	const rafRef = useRef<number | null>(null)
	const lastRef = useRef<number | null>(null)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return undefined
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting && !hasAutoPlayed.current) {
					hasAutoPlayed.current = true
					setIsPlaying(true)
				}
			},
			{ threshold: 0.4 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (!isPlaying) {
			lastRef.current = null
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
			rafRef.current = null
			return undefined
		}
		const tick = (now: number) => {
			if (lastRef.current === null) lastRef.current = now
			const dt = now - lastRef.current
			lastRef.current = now
			// Wrap around at the end of the timeline so the figure auto-loops.
			setElapsed(prev => {
				const next = prev + dt
				return next >= TOTAL_MS ? next - TOTAL_MS : next
			})
			rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
	}, [isPlaying])

	const reset = useCallback(() => {
		setElapsed(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => !prev)
	}, [])

	const { id: phaseId, t } = phaseInfo(elapsed)
	const caption = stickyCaption(elapsed)

	const adminPacket = phaseId === 'admin-ping' ? lerp(adminRight, supLeft, t) : null
	const supPushPacket = phaseId === 'sup-push' ? lerp(supBottom, oc0Top, t) : null
	const clientPacket = phaseId === 'client-ping' ? lerp(cl0Top, oc0Bottom, t) : null

	const adminActive = phaseId === 'admin-ping'
	// Keep the supervisor lit through the rebuild beat so it stays in focus
	// past the "patch" pulse and the push packet.
	const supActive =
		phaseId === 'admin-ping' ||
		phaseId === 'sup-patch' ||
		phaseId === 'sup-push' ||
		phaseId === 'oc-rebuild'
	const supEmphasis: NodeEmphasis = phaseId === 'sup-patch' ? 'patch' : undefined
	const oc0Active =
		phaseId === 'client-ping' ||
		phaseId === 'oc-state' ||
		phaseId === 'pause' ||
		phaseId === 'sup-push' ||
		phaseId === 'oc-rebuild' ||
		phaseId === 'done'
	const oc0Emphasis: NodeEmphasis =
		phaseId === 'oc-rebuild' || phaseId === 'done' ? 'patch' : undefined
	const cl0Active = phaseId === 'client-ping'

	return (
		<div ref={containerRef} className={FIGURE_CONTAINER_CLASS}>
			<svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" role="img">
				<title>OpenClaw supervisor coordinating child agents and clients</title>

				{/* Sandbox container */}
				<rect
					x={SANDBOX.x}
					y={SANDBOX.y}
					width={SANDBOX.w}
					height={SANDBOX.h}
					rx={6}
					fill="transparent"
					className="text-secondary"
					stroke="currentColor"
					strokeWidth={1}
					style={{ opacity: 0.4 }}
				/>

				{/* Sandbox legend */}
				<g className={AMBER.text}>
					<rect
						x={SB_LEGEND.x}
						y={SB_LEGEND.y}
						width={SB_LEGEND.w}
						height={SB_LEGEND.h}
						rx={NODE_RADIUS}
						className="fill-amber-500/15"
						stroke="currentColor"
						strokeWidth={1}
						style={{ opacity: 0.9 }}
					/>
					<text
						x={SB_LEGEND.x + SB_LEGEND.w / 2}
						y={SB_LEGEND.y + SB_LEGEND.h / 2 + 4}
						textAnchor="middle"
						fill="currentColor"
						className="font-medium font-sans"
						fontSize={11}
					>
						Sandbox
					</text>
				</g>

				{/* Server label (the entire group is one server) */}
				<text
					x={SANDBOX.x + SANDBOX.w / 2}
					y={SANDBOX.y - 6}
					textAnchor="middle"
					fill="currentColor"
					className="font-sans text-secondary/50"
					fontSize={10}
				>
					Server
				</text>

				{/* Admin */}
				<NodeBox box={ADMIN} label="Admin" active={adminActive} />

				{/* Supervisor */}
				<NodeBox box={SUP} label="Supervisor OpenClaw" active={supActive} emphasis={supEmphasis} />

				{/* OpenClaws (each one is a sandbox; see legend) */}
				<NodeBox box={OC0} label="OpenClaw 0" tint active={oc0Active} emphasis={oc0Emphasis} />
				<NodeBox box={OC1} label="OpenClaw 1" tint />
				<g className={AMBER.text}>
					<text
						x={(OC1.x + OC1.w + OCN.x) / 2}
						y={OC1.y + OC1.h / 2 + 5}
						textAnchor="middle"
						fill="currentColor"
						fontSize={14}
						style={{ opacity: 0.6 }}
					>
						...
					</text>
				</g>
				<NodeBox box={OCN} label="OpenClaw N" tint />

				{/* Clients */}
				<NodeBox box={CL0} label="Client 0" active={cl0Active} />
				<NodeBox box={CL1} label="Client 1" />
				<g className="text-secondary">
					<text
						x={(CL1.x + CL1.w + CLN.x) / 2}
						y={CL1.y + CL1.h / 2 + 5}
						textAnchor="middle"
						fill="currentColor"
						fontSize={14}
						style={{ opacity: 0.5 }}
					>
						...
					</text>
				</g>
				<NodeBox box={CLN} label="Client N" />

				{/* Packets (drawn last so they float above everything) */}
				<Packet at={adminPacket} />
				<Packet at={supPushPacket} />
				<Packet at={clientPacket} />
			</svg>

			{/* Live caption (sticky between beats so it stays readable) */}
			<div className="mt-3 flex h-5 items-center justify-center font-sans text-primary/80 text-xs">
				{caption}
			</div>

			{/* Scrubber */}
			<button
				type="button"
				aria-label="Scrub OpenClaw fleet playback"
				className="relative mt-1 h-0.5 w-full cursor-pointer rounded-full bg-subtle/20"
				onClick={e => {
					const rect = e.currentTarget.getBoundingClientRect()
					const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
					setElapsed(pct * TOTAL_MS)
					setIsPlaying(false)
				}}
			>
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-primary/20"
					style={{ width: `${(elapsed / TOTAL_MS) * 100}%` }}
				/>
			</button>

			{/* Controls */}
			<div className="mt-3 flex items-center gap-2">
				<Button size="sm" variant="icon" onClick={togglePlay}>
					{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
				</Button>
				<Button size="sm" variant="icon" onClick={reset}>
					<RestartIcon className="h-4 w-4" />
				</Button>
				<Figure.Share />
			</div>
		</div>
	)
}
