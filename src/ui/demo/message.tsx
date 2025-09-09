'use client'

import { motion } from 'framer-motion'
import { Chart, type ChartData } from './blocks/chart'
import { Stats, type StatsData } from './blocks/stats'

const CHAR_DELAY = 0.02
const TAG_POP_DURATION = 0.25

function Text({ content, delayStart = 0 }: { content: string; delayStart?: number }) {
	let globalCharIndex = 0
	return (
		<span>
			{content.split(/(\s+)/).map((token, tokenIndex) => {
				const isWhitespace = token.trim() === ''
				if (isWhitespace) {
					// Preserve whitespace and allow wrapping at spaces
					globalCharIndex += token.length
					return (
						<span key={`space-${tokenIndex}`} style={{ whiteSpace: 'pre' }}>
							{token}
						</span>
					)
				}

				const word = token
				const wordStartIndex = globalCharIndex
				globalCharIndex += word.length
				return (
					<span key={`word-${tokenIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
						{word.split('').map((character, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									delay: delayStart + (wordStartIndex + index) * CHAR_DELAY,
									duration: 0.001
								}}
								style={{ display: 'inline-block' }}
							>
								{character}
							</motion.span>
						))}
					</span>
				)
			})}
		</span>
	)
}

function Tag({ content, delayStart = 0 }: { content: string; delayStart?: number }) {
	return (
		<motion.span
			className="rounded-full border-1 border-gray-600 bg-gray-900 px-1.5 py-0.5 text-blue-400 text-sm dark:border-gray-300 dark:bg-gray-200 dark:text-blue-600"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				damping: 30,
				delay: delayStart,
				duration: TAG_POP_DURATION,
				stiffness: 500,
				type: 'spring'
			}}
		>
			@{content}
		</motion.span>
	)
}

type MessagePart = { type: 'text'; content: string } | { type: 'tag'; content: string }

type Message =
	| { type: 'user'; parts: MessagePart[] }
	| { type: 'assistant'; parts: MessagePart[] }
	| { type: 'reasoning'; text: string }
	| { type: 'chart'; data: ChartData }
	| { type: 'stats'; data: StatsData }

function MessagePart({ part, delayStart = 0 }: { part: MessagePart; delayStart?: number }) {
	switch (part.type) {
		case 'text':
			return <Text content={part.content} delayStart={delayStart} />
		case 'tag':
			return <Tag content={part.content} delayStart={delayStart} />
	}
}

export function MessageText({ parts, animated }: { parts: MessagePart[]; animated?: boolean }) {
	let accumulatedDelay = 0
	return (
		<div className="flex items-center justify-end gap-0.5">
			{parts.map((part, index) => {
				const startDelayForPart = accumulatedDelay
				if (animated) {
					if (part.type === 'text') accumulatedDelay += part.content.length * CHAR_DELAY
					else accumulatedDelay += TAG_POP_DURATION / 2
				}
				return <MessagePart key={index} part={part} delayStart={startDelayForPart} />
			})}
		</div>
	)
}

function UserMessage({ parts }: { parts: MessagePart[] }) {
	return (
		<div className="mb-6 flex justify-end">
			<div className="rounded-2xl border-1 border-gray-200 bg-black px-3 py-1 text-white shadow-sm dark:border-gray-200 dark:bg-white dark:text-black">
				<MessageText parts={parts} animated />
			</div>
		</div>
	)
}

function AssistantMessage({ parts }: { parts: MessagePart[] }) {
	return (
		<div className="flex max-w-[400px] justify-start">
			<div className="rounded-2xl border-1 border-gray-200 bg-white px-3 py-1 text-black shadow-sm dark:border-gray-800 dark:bg-transparent dark:from-gray-950 dark:to-gray-900 dark:text-white">
				<MessageText parts={parts} />
			</div>
		</div>
	)
}

function ReasoningMessage({ text }: { text: string }) {
	return (
		<div className="flex justify-start">
			<div className="bg-white dark:border-gray-800 dark:bg-transparent">
				<motion.span
					className="bg-clip-text text-transparent [--reasoning-gradient:linear-gradient(90deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.1)_100%)] dark:[--reasoning-gradient:linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.1)_100%)]"
					initial={{ backgroundPositionX: '100%' }}
					animate={{ backgroundPositionX: '-100%' }}
					transition={{ duration: 1.8, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
					style={{
						backgroundImage: 'var(--reasoning-gradient)',
						backgroundSize: '200% 100%',
						display: 'inline-block',
						WebkitBackgroundClip: 'text'
					}}
				>
					{text}
				</motion.span>
			</div>
		</div>
	)
}

function Block({
	block: { type, data }
}: {
	block: { type: 'chart'; data: ChartData } | { type: 'stats'; data: StatsData }
}) {
	switch (type) {
		case 'chart':
			return <Chart data={data} />
		case 'stats':
			return <Stats data={data} />
	}
}

function UIMessage({
	block
}: {
	block: { type: 'chart'; data: ChartData } | { type: 'stats'; data: StatsData }
}) {
	return (
		<motion.div
			className="flex max-w-[80%] justify-start"
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25, ease: 'easeOut' }}
		>
			<Block block={block} />
		</motion.div>
	)
}

export function Message(message: Message) {
	switch (message.type) {
		case 'user':
			return <UserMessage parts={message.parts} />
		case 'assistant':
			return <AssistantMessage parts={message.parts} />
		case 'chart':
			return <UIMessage block={{ data: message.data, type: 'chart' }} />
		case 'stats':
			return <UIMessage block={{ data: message.data, type: 'stats' }} />
		case 'reasoning':
			return <ReasoningMessage text={message.text} />
	}
}
