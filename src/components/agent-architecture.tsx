'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Section } from './section'

const primitives = [
	{
		id: 'input',
		label: 'Input',
		description: 'Parse and understand the request',
		detail: 'Natural language → structured intent'
	},
	{
		id: 'reasoning',
		label: 'Reasoning',
		description: 'Decompose into subtasks',
		detail: 'Plan execution strategy, identify dependencies'
	},
	{
		id: 'dispatch',
		label: 'Parallel Dispatch',
		description: 'Execute tools concurrently',
		tools: [
			{ name: 'memory.query', time: '34ms' },
			{ name: 'tools.execute', time: '89ms' },
			{ name: 'context.fetch', time: '52ms' }
		]
	},
	{
		id: 'memory',
		label: 'Memory',
		description: 'Retrieve and compress context',
		detail: 'Retrieved 847 tokens → compacted to 203'
	},
	{
		id: 'composition',
		label: 'Composition',
		description: 'Synthesize results',
		detail: 'Merge tool outputs into coherent response'
	},
	{
		id: 'ui',
		label: 'Generative UI',
		description: 'Render dynamic components',
		components: ['DataCard', 'ActionPanel', 'StatusView']
	}
]

function ConnectionLine({ delay }: { delay: number }) {
	return (
		<div className="flex justify-center py-1">
			<motion.div
				className="h-6 w-px bg-border"
				initial={{ scaleY: 0, opacity: 0 }}
				animate={{ scaleY: 1, opacity: 1 }}
				transition={{ delay, duration: 0.3, ease: 'easeOut' }}
				style={{ originY: 0 }}
			/>
		</div>
	)
}

function PrimitiveNode({
	primitive,
	delay
}: {
	primitive: (typeof primitives)[number]
	delay: number
}) {
	return (
		<motion.div
			className="relative"
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
		>
			<div className="rounded-lg border border-border bg-surface/50 p-4 transition-colors duration-300 hover:border-border-hover">
				<div className="flex items-center justify-between">
					<span className="font-mono text-xs text-code-green">{primitive.label}</span>
					{primitive.id === 'reasoning' && (
						<motion.span
							className="font-mono text-[10px] text-text-tertiary"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: delay + 0.3, duration: 0.3 }}
						>
							12ms
						</motion.span>
					)}
					{primitive.id === 'composition' && (
						<motion.span
							className="font-mono text-[10px] text-text-tertiary"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: delay + 0.3, duration: 0.3 }}
						>
							23ms
						</motion.span>
					)}
				</div>
				<p className="mt-1 text-sm text-text-secondary">{primitive.description}</p>

				{primitive.tools && (
					<div className="mt-3 grid grid-cols-3 gap-2">
						{primitive.tools.map((tool, i) => (
							<motion.div
								key={tool.name}
								className="rounded-md border border-border bg-bg/50 px-2.5 py-2 text-center"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									delay: delay + 0.2 + i * 0.1,
									duration: 0.3
								}}
							>
								<span className="block font-mono text-[10px] text-text-secondary">
									{tool.name}
								</span>
								<motion.span
									className="mt-1 block font-mono text-[10px] text-code-green"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: delay + 0.5 + i * 0.1, duration: 0.2 }}
								>
									&#10003; {tool.time}
								</motion.span>
							</motion.div>
						))}
					</div>
				)}

				{primitive.components && (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{primitive.components.map((comp, i) => (
							<motion.span
								key={comp}
								className="rounded border border-border bg-bg/50 px-2 py-0.5 font-mono text-[10px] text-text-secondary"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: delay + 0.2 + i * 0.12, duration: 0.3 }}
							>
								&lt;{comp} /&gt;
							</motion.span>
						))}
					</div>
				)}

				{primitive.detail && !primitive.tools && !primitive.components && (
					<motion.p
						className="mt-1 font-mono text-[11px] text-text-tertiary"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: delay + 0.3, duration: 0.3 }}
					>
						{primitive.detail}
					</motion.p>
				)}
			</div>
		</motion.div>
	)
}

export function AgentArchitecture() {
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { once: true, amount: 0.15 })

	const baseDelay = 0.2
	const stepDelay = 0.35

	return (
		<Section>
			<div className="mx-auto max-w-[480px]" ref={ref}>
				<motion.p
					className="mb-10 text-center font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]"
					initial={{ opacity: 0 }}
					animate={isInView ? { opacity: 1 } : {}}
					transition={{ duration: 0.4 }}
				>
					Architecture
				</motion.p>

				{isInView && (
					<div>
						{primitives.map((primitive, i) => (
							<div key={primitive.id}>
								{i > 0 && <ConnectionLine delay={baseDelay + i * stepDelay - 0.15} />}
								<PrimitiveNode
									primitive={primitive}
									delay={baseDelay + i * stepDelay}
								/>
							</div>
						))}
					</div>
				)}

				<motion.p
					className="mt-10 text-center font-mono text-[11px] text-text-tertiary"
					initial={{ opacity: 0 }}
					animate={isInView ? { opacity: 1 } : {}}
					transition={{ delay: baseDelay + primitives.length * stepDelay, duration: 0.4 }}
				>
					Primitives, not pipelines
				</motion.p>
			</div>
		</Section>
	)
}
