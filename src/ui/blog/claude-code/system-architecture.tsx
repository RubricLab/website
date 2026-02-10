'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'
import { CORE_TOOL_NAMES } from '~/ui/blog/claude-code/tools-table'
import { Button } from '~/ui/button'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'
import { ShareIcon } from '~/ui/icons/share'

const COMPONENT_ID = 'system-architecture'

type MessageRole = 'system' | 'user' | 'assistant' | 'tool'

type Message = {
	role: MessageRole
	content: string
	toolCall?: string
}

const SYSTEM_MESSAGE: Message = {
	content: 'You are Claude Code, a coding agent...',
	role: 'system'
}

const MESSAGES: Message[] = [
	{ content: 'How does login work?', role: 'user' },
	{ content: 'Let me find the relevant code.', role: 'assistant', toolCall: 'Read' },
	{ content: 'Found authentication logic', role: 'tool' },
	{ content: 'Login validates credentials and creates a session.', role: 'assistant' }
]

const TOOLS = CORE_TOOL_NAMES

type ModelConfig = {
	id: string
	label: string
	contextWindow: number // in K tokens
}

const MODELS: ModelConfig[] = [
	{ contextWindow: 200, id: 'opus-4', label: 'claude-opus-4' },
	{ contextWindow: 200, id: 'sonnet-4', label: 'claude-sonnet-4' },
	{ contextWindow: 200, id: 'haiku-3.5', label: 'claude-haiku-3.5' },
	{ contextWindow: 100, id: 'claude-2', label: 'claude-2.0' }
]

// Max context window for scaling (200K)
const MAX_CONTEXT_HEIGHT = 280
const MAX_CONTEXT_TOKENS = 200

const BASE_STEP_DURATION_MS = 1500
const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const
type Speed = (typeof SPEED_OPTIONS)[number]

const roleColors: Record<MessageRole, string> = {
	assistant: 'bg-violet-500/20 border-violet-500/40 text-violet-600 dark:text-violet-400',
	system: 'bg-slate-500/20 border-slate-500/40 text-slate-600 dark:text-slate-400',
	tool: 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400',
	user: 'bg-sky-500/20 border-sky-500/40 text-sky-600 dark:text-sky-400'
}

const roleLabels: Record<MessageRole, string> = {
	assistant: 'Claude',
	system: 'System',
	tool: 'Tool',
	user: 'User'
}

const MessageBlock = ({
	message,
	isNew,
	isToolActive
}: {
	message: Message
	isNew: boolean
	isToolActive?: boolean
}) => {
	return (
		<div
			className={cn(
				'flex flex-col gap-1 rounded-lg border px-3 py-2 transition-all duration-300',
				roleColors[message.role],
				isNew ? 'animate-slide-in' : ''
			)}
		>
			<div className="flex items-center justify-between">
				<span className="font-medium text-[10px] uppercase tracking-wide opacity-70">
					{roleLabels[message.role]}
				</span>
				{message.toolCall && (
					<span
						className={cn(
							'rounded-full bg-amber-500/30 px-2 py-0.5 font-mono text-[10px] transition-all',
							isToolActive ? 'animate-pulse' : ''
						)}
					>
						{message.toolCall}
					</span>
				)}
			</div>
			<span className="text-xs">{message.content}</span>
		</div>
	)
}

const ToolsCatalog = ({ activeToolIndex }: { activeToolIndex: number | null }) => {
	return (
		<div className="flex min-w-0 flex-col gap-2">
			<p className="font-medium text-[10px] text-secondary uppercase tracking-wide">Tools Catalog</p>
			<div className="flex min-w-0 flex-col gap-1">
				{TOOLS.map(tool => (
					<div
						key={tool}
						className={cn(
							'w-full truncate rounded border px-2 py-1 font-mono text-[11px] transition-all duration-300',
							activeToolIndex !== null && TOOLS[activeToolIndex] === tool
								? 'border-amber-500/60 bg-amber-500/20 text-amber-600 dark:text-amber-400'
								: 'border-subtle bg-subtle/30 text-secondary'
						)}
					>
						{tool}
					</div>
				))}
			</div>
		</div>
	)
}

export const SystemArchitecture = () => {
	const [isPlaying, setIsPlaying] = useState(true)
	const [speed, setSpeed] = useState<Speed>(1)
	const [currentStep, setCurrentStep] = useState(0)
	const [selectedModel, setSelectedModel] = useState<string>('sonnet-4')
	const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)

	const { copied, handleCopy } = useClipboard()
	const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const currentModel = MODELS.find(m => m.id === selectedModel) ?? {
		contextWindow: 200,
		id: 'sonnet-4',
		label: 'claude-sonnet-4'
	}
	const contextWindowHeight = (currentModel.contextWindow / MAX_CONTEXT_TOKENS) * MAX_CONTEXT_HEIGHT

	// Auto-scroll to bottom when new messages appear
	// biome-ignore lint/correctness/useExhaustiveDependencies: need to scroll when step changes
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
		}
	}, [currentStep])

	const copyLink = useCallback(() => {
		const url = `${window.location.origin}${window.location.pathname}#${COMPONENT_ID}`
		handleCopy(url)
	}, [handleCopy])

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	const visibleMessages = MESSAGES.slice(0, currentStep + 1)

	// Find the step indices for tool call and tool result
	const toolCallStepIndex = MESSAGES.findIndex(m => m.toolCall !== undefined)
	const toolResultStepIndex = MESSAGES.findIndex(m => m.role === 'tool')

	// Show arrows once we've reached those steps (and keep showing them)
	const showCallArrow = toolCallStepIndex !== -1 && currentStep >= toolCallStepIndex
	const showResultArrow = toolResultStepIndex !== -1 && currentStep >= toolResultStepIndex

	// Highlight the tool in the catalog while arrows are visible
	const toolCallMessage = toolCallStepIndex !== -1 ? MESSAGES[toolCallStepIndex] : null
	const activeToolIndex =
		showCallArrow && toolCallMessage?.toolCall ? TOOLS.indexOf(toolCallMessage.toolCall) : null
	const isComplete = currentStep >= MESSAGES.length - 1

	const stepDuration = BASE_STEP_DURATION_MS / speed

	const reset = useCallback(() => {
		setCurrentStep(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (isComplete) {
			reset()
		} else {
			setIsPlaying(prev => !prev)
		}
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) {
			if (stepIntervalRef.current) {
				clearInterval(stepIntervalRef.current)
				stepIntervalRef.current = null
			}
			return
		}

		stepIntervalRef.current = setInterval(() => {
			setCurrentStep(prev => (prev < MESSAGES.length - 1 ? prev + 1 : prev))
		}, stepDuration)

		return () => {
			if (stepIntervalRef.current) {
				clearInterval(stepIntervalRef.current)
			}
		}
	}, [isPlaying, isComplete, stepDuration])

	useEffect(() => {
		if (isComplete) {
			setIsPlaying(false)
		}
	}, [isComplete])

	return (
		<section
			id={COMPONENT_ID}
			className="w-full scroll-mt-8 rounded-custom border border-subtle bg-subtle/10 p-4"
		>
			{/* Model selector */}
			<div className="relative mb-3 flex items-center gap-2">
				<button
					type="button"
					onClick={() => setIsModelDropdownOpen(prev => !prev)}
					className="flex items-center gap-1 rounded-full bg-violet-500/20 px-2 py-0.5 font-mono text-[10px] text-violet-600 transition-colors hover:bg-violet-500/30 dark:text-violet-400"
				>
					{currentModel.label}
					<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<title>Dropdown</title>
						<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				{isModelDropdownOpen && (
					<div className="absolute top-full left-0 z-10 mt-1 rounded-lg border border-subtle bg-primary p-1 shadow-lg">
						{MODELS.map(model => (
							<button
								key={model.id}
								type="button"
								onClick={() => {
									setSelectedModel(model.id)
									setIsModelDropdownOpen(false)
								}}
								className={cn(
									'block w-full rounded px-3 py-1 text-left font-mono text-[10px] transition-colors',
									model.id === selectedModel
										? 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
										: 'text-secondary hover:bg-subtle'
								)}
							>
								{model.label}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Main diagram */}
			<div className="relative flex gap-4">
				{/* Context Window */}
				<div className="flex min-w-0 flex-1 flex-col gap-2 self-start rounded-lg border border-secondary/30 border-dashed p-3">
					<div className="flex items-center justify-between">
						<p className="font-medium text-[10px] text-secondary uppercase tracking-wide">
							Context Window
						</p>
						<span className="font-mono text-[10px] text-secondary">{currentModel.contextWindow}K</span>
					</div>
					<div
						ref={scrollContainerRef}
						style={{ height: `${contextWindowHeight}px` }}
						className="scrollbar-none flex flex-col gap-1.5 overflow-y-auto transition-all duration-300"
					>
						{/* System prompt is always visible */}
						<MessageBlock message={SYSTEM_MESSAGE} isNew={false} />
						{/* Animated messages */}
						{visibleMessages.map((msg, idx) => (
							<MessageBlock
								key={idx}
								message={msg}
								isNew={idx === currentStep}
								isToolActive={idx === currentStep && msg.toolCall !== undefined}
							/>
						))}
					</div>
				</div>

				{/* Arrow connector between context and tools */}
				<div className="flex w-20 shrink-0 flex-col items-center justify-center gap-3">
					{showCallArrow && (
						<div className="flex items-center gap-1 text-amber-500">
							<span className="text-xs">call</span>
							<svg
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Arrow right</title>
								<path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					)}
					{showResultArrow && (
						<div className="flex items-center gap-1 text-amber-500">
							<svg
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Arrow left</title>
								<path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-xs">result</span>
						</div>
					)}
				</div>

				{/* Tools Catalog */}
				<div className="w-32 shrink-0 rounded-lg border border-secondary/30 border-dashed p-3">
					<ToolsCatalog activeToolIndex={activeToolIndex} />
				</div>
			</div>

			{/* CLI label */}
			<div className="mt-3 flex items-center justify-center">
				<span className="rounded-full bg-subtle px-3 py-1 font-mono text-[10px] text-secondary">
					Terminal Environment
				</span>
			</div>

			{/* Controls */}
			<div className="mt-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
					</Button>
					{SPEED_OPTIONS.map(s => (
						<Button
							key={s}
							size="sm"
							variant={speed === s ? 'default' : 'ghost'}
							onClick={() => setSpeed(s)}
						>
							{s}x
						</Button>
					))}
					<Button size="sm" variant="icon" onClick={reset}>
						<RestartIcon className="h-4 w-4" />
					</Button>
				</div>
				<Button size="sm" variant="icon" onClick={copyLink}>
					<ShareIcon className="h-4 w-4" />
				</Button>
			</div>
		</section>
	)
}
