'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import {
	BLOCK_COLORS,
	type BlockColor,
	type BlockColorName,
	FALLBACK_BLOCK_COLOR,
	FIGURE_CONTAINER_CLASS
} from '~/ui/blog/figure-palette'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const LABELS = ['A', 'B', 'C'] as const
const PIPELINE_SIZE = 30
const ASSEMBLY_SIZE = PIPELINE_SIZE
const LEGEND_SIZE = 20
const ARROW_H = 12
const LEGEND_GAP = 8
const H = 320
const MAX_SLOTS = 5
const MIN_ASSEMBLY_LENGTH = 2
const INITIAL_MAX_ASSEMBLY_LENGTH = 4
const ABSOLUTE_MAX_ASSEMBLY_LENGTH = 5
const ASSEMBLY_INTERVAL_MS = 1800
const FIGURE_PADDING_X = 16
const CONTROLS_LEFT = 8
const HEADING_TOP = 12
const CONTROLS_ROW_CENTER_Y = H - 20
const CONTROL_BUTTON_SIZE = 22

type Label = (typeof LABELS)[number]

// Each pipeline label maps to a palette color from the shared figure palette
// so primitive blocks read the same way across blog figures.
const LABEL_TO_COLOR: Record<Label, BlockColorName> = {
	A: 'sky',
	B: 'amber',
	C: 'violet'
}

const colorsFor = (label: Label): BlockColor =>
	BLOCK_COLORS[LABEL_TO_COLOR[label]] ?? FALLBACK_BLOCK_COLOR

const WORKSPACE_TOP = 52
const WORKSPACE_BOTTOM = H - 56
const workspaceCenterY = WORKSPACE_TOP + (WORKSPACE_BOTTOM - WORKSPACE_TOP) / 2
const PIPELINE_TOTAL_H = LABELS.length * PIPELINE_SIZE + (LABELS.length - 1) * ARROW_H
const PIPELINE_TOP = workspaceCenterY - PIPELINE_TOTAL_H / 2
const pipelineY = (i: number) => PIPELINE_TOP + i * (PIPELINE_SIZE + ARROW_H)
const assemblyStartY = (total: number, centerY: number) => {
	const totalH = total * ASSEMBLY_SIZE + (total - 1) * ARROW_H
	return centerY - totalH / 2
}
const assemblyY = (i: number, total: number, centerY: number) =>
	assemblyStartY(total, centerY) + i * (ASSEMBLY_SIZE + ARROW_H)

type AssemblyState = {
	maxLength: number
	outcomes: number
	sequence: Label[]
}

// Builds a stable key for uniqueness checks; input ['A','B','A'] -> output 'A>B>A'.
const sequenceKey = (sequence: Label[]) => sequence.join('>')
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const labelAt = (index: number) => LABELS[index] ?? LABELS[0]
const randomLabel = () => labelAt(randomInt(0, LABELS.length - 1))
const createRandomSequence = (length: number) => Array.from({ length }, randomLabel)
const sequenceFromValue = (length: number, value: number) => {
	let remainder = value
	return Array.from({ length }, () => {
		const next = labelAt(remainder % LABELS.length)
		remainder = Math.floor(remainder / LABELS.length)
		return next
	})
}

const pickUniqueSequence = (seen: Set<string>, maxLength: number) => {
	let attempts = 0
	let localMaxLength = maxLength

	while (attempts < 1000) {
		const length = randomInt(MIN_ASSEMBLY_LENGTH, localMaxLength)
		const sequence = createRandomSequence(length)
		const key = sequenceKey(sequence)
		if (!seen.has(key)) return { nextMaxLength: localMaxLength, sequence }

		attempts += 1
		if (attempts % 300 !== 0) continue
		if (localMaxLength >= ABSOLUTE_MAX_ASSEMBLY_LENGTH) continue
		localMaxLength += 1
	}

	for (let length = MIN_ASSEMBLY_LENGTH; length <= localMaxLength; length += 1) {
		const combinations = LABELS.length ** length
		for (let value = 0; value < combinations; value += 1) {
			const sequence = sequenceFromValue(length, value)
			if (seen.has(sequenceKey(sequence))) continue
			return { nextMaxLength: localMaxLength, sequence }
		}
	}

	if (localMaxLength >= ABSOLUTE_MAX_ASSEMBLY_LENGTH) return null

	const expandedLength = localMaxLength + 1
	return pickUniqueSequence(seen, expandedLength)
}

const Block = ({
	label,
	left,
	top,
	size,
	dim = false,
	hidden = false
}: {
	label: Label
	left: number | string
	top: number
	size: number
	dim?: boolean
	hidden?: boolean
}) => {
	const colors = colorsFor(label)

	return (
		<div
			className={cn(
				'absolute flex items-center justify-center rounded-md border font-medium font-mono transition-all duration-700 ease-in-out',
				size <= LEGEND_SIZE ? 'text-[9px]' : 'text-[11px]',
				dim
					? `${colors.dimBorder} ${colors.dimBg} ${colors.dimText}`
					: `${colors.border} ${colors.bg} ${colors.text}`
			)}
			style={{
				height: size,
				left,
				opacity: hidden ? 0 : 1,
				top,
				width: size
			}}
		>
			{label}
		</div>
	)
}

const DownArrow = ({
	left,
	top,
	visible
}: {
	left: number | string
	top: number
	visible: boolean
}) => (
	<svg
		className="absolute text-secondary transition-all duration-700 ease-in-out"
		style={{
			height: ARROW_H,
			left,
			opacity: visible ? 0.4 : 0,
			top,
			width: 10
		}}
		viewBox={`0 0 10 ${String(ARROW_H)}`}
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
	>
		<title>Arrow down</title>
		<path
			d={`M5 0v${String(ARROW_H)}M2 ${String(ARROW_H - 3)}l3 3 3-3`}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const PipelinePrimitivesFigure = () => {
	const [assembly, setAssembly] = useState<AssemblyState>({
		maxLength: INITIAL_MAX_ASSEMBLY_LENGTH,
		outcomes: 0,
		sequence: []
	})
	const [isPlaying, setIsPlaying] = useState(true)
	const seenSequencesRef = useRef<Set<string>>(new Set())

	const resetAssembly = useCallback(() => {
		setAssembly({
			maxLength: INITIAL_MAX_ASSEMBLY_LENGTH,
			outcomes: 0,
			sequence: []
		})
		seenSequencesRef.current.clear()
		setIsPlaying(true)
	}, [])

	useEffect(() => {
		resetAssembly()
	}, [resetAssembly])

	const advanceAssembly = useCallback(() => {
		let shouldStop = false

		setAssembly(prev => {
			const seen = seenSequencesRef.current
			const next = pickUniqueSequence(seen, prev.maxLength)
			if (!next) {
				shouldStop = true
				return prev
			}
			seen.add(sequenceKey(next.sequence))

			return {
				maxLength: next.nextMaxLength,
				outcomes: prev.outcomes + 1,
				sequence: next.sequence
			}
		})

		if (shouldStop) setIsPlaying(false)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => !prev)
	}, [])

	useEffect(() => {
		if (!isPlaying) return undefined

		const timer = setInterval(advanceAssembly, ASSEMBLY_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [advanceAssembly, isPlaying])

	const pipelineCenterX = '25%'
	const pipelineLeft = `calc(25% - ${String(PIPELINE_SIZE / 2)}px)`
	const pipelineArrowX = 'calc(25% - 5px)'
	const rightCenterX = '75%'
	const assemblyLeft = `calc(75% - ${String(ASSEMBLY_SIZE / 2)}px)`
	const assemblyArrowX = 'calc(75% - 5px)'
	const assemblyCenterY = workspaceCenterY
	const legendTotalW = LABELS.length * LEGEND_SIZE + (LABELS.length - 1) * LEGEND_GAP
	const legendBaseLeft = `calc(100% - ${String(FIGURE_PADDING_X + legendTotalW)}px)`
	const legendTop = CONTROLS_ROW_CENTER_Y - LEGEND_SIZE / 2

	return (
		<div className={FIGURE_CONTAINER_CLASS}>
			<div className="relative w-full overflow-hidden" style={{ height: H }}>
				{/* === LEFT HALF: Pipeline (always visible) === */}

				{/* Pipeline blocks */}
				{LABELS.map((label, i) => (
					<Block
						key={`pipe-${label}`}
						label={label}
						size={PIPELINE_SIZE}
						left={pipelineLeft}
						top={pipelineY(i)}
					/>
				))}

				{/* Pipeline arrows */}
				{LABELS.slice(0, -1).map((_, i) => (
					<DownArrow
						key={`pa-${String(i)}`}
						left={pipelineArrowX}
						top={pipelineY(i) + PIPELINE_SIZE}
						visible
					/>
				))}

				{/* Pipeline footer label */}
				<p
					className="absolute text-secondary/50 transition-all duration-700"
					style={{ left: pipelineCenterX, top: HEADING_TOP, transform: 'translateX(-50%)' }}
				>
					Pipeline
				</p>

				{/* === RIGHT HALF: Primitives === */}

				{/* Legend blocks (just above primitives stack) */}
				{LABELS.map((label, i) => (
					<Block
						key={`legend-${label}`}
						label={label}
						size={LEGEND_SIZE}
						left={`calc(${legendBaseLeft} + ${String(i * (LEGEND_SIZE + LEGEND_GAP))}px)`}
						top={legendTop}
						dim={false}
						hidden={false}
					/>
				))}

				{/* Right half heading */}
				<p
					className="absolute text-secondary/50 transition-all duration-700"
					style={{
						left: rightCenterX,
						opacity: 1,
						top: HEADING_TOP,
						transform: 'translateX(-50%)'
					}}
				>
					Primitives
				</p>

				{/* Workspace block slots */}
				{Array.from({ length: MAX_SLOTS }, (_, i) => {
					const total = assembly.sequence.length
					const isActive = i < total
					const label = isActive ? (assembly.sequence[i] ?? 'A') : 'A'

					return (
						<Block
							key={`ws-${String(i)}`}
							label={label}
							size={ASSEMBLY_SIZE}
							left={assemblyLeft}
							top={isActive ? assemblyY(i, total, assemblyCenterY) : assemblyCenterY - ASSEMBLY_SIZE / 2}
							hidden={!isActive}
						/>
					)
				})}

				{/* Workspace arrow slots */}
				{Array.from({ length: MAX_SLOTS - 1 }, (_, i) => {
					const total = assembly.sequence.length
					const isActive = i < total - 1

					return (
						<DownArrow
							key={`wa-${String(i)}`}
							left={assemblyArrowX}
							top={isActive ? assemblyY(i, total, assemblyCenterY) + ASSEMBLY_SIZE : assemblyCenterY}
							visible={isActive}
						/>
					)
				})}

				{/* Controls */}
				<div
					className="absolute flex items-center gap-2"
					style={{
						left: CONTROLS_LEFT,
						top: CONTROLS_ROW_CENTER_Y - CONTROL_BUTTON_SIZE / 2
					}}
				>
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
					</Button>
					<Button size="sm" variant="icon" onClick={resetAssembly}>
						<RestartIcon className="h-4 w-4" />
					</Button>
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
