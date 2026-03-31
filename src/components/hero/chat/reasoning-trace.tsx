'use client'

export function ReasoningTrace({ progress }: { summary: string; steps: number; progress: number }) {
	if (progress <= 0) return null
	const done = progress > 0.6

	return (
		<div className="flex items-center gap-2 py-1">
			<span className="text-[12px] text-secondary">
				{done ? 'Thought for 4 steps' : (
					<>
						Thinking
						<span className="inline-flex gap-px ml-1">
							{[0, 1, 2].map(i => (
								<span key={i} className="w-[3px] h-[3px] rounded-full bg-secondary" style={{ animation: 'pulse-dot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
							))}
						</span>
					</>
				)}
			</span>
		</div>
	)
}
