'use client'

export function ReasoningTrace({
	summary,
	steps,
	progress,
}: {
	summary: string
	steps: number
	progress: number
}) {
	if (progress <= 0) return null

	const isComplete = progress > 0.5
	const summaryP = isComplete ? Math.min(1, (progress - 0.5) / 0.5) : 0
	const summaryChars = Math.floor(summaryP * summary.length)

	return (
		<div className="flex items-start gap-2">
			<span
				className="text-[10px] text-text-tertiary mt-[2px] select-none transition-transform duration-200"
				style={{ transform: isComplete ? 'rotate(90deg)' : 'rotate(0deg)' }}
			>
				▸
			</span>
			<div className="min-w-0">
				<div className="flex items-center gap-2">
					<span className="font-sans text-[12px] text-text-secondary font-medium">
						Thinking
					</span>
					{!isComplete && <ThinkingDots />}
					{isComplete && (
						<span className="font-sans text-[11px] text-text-tertiary">
							{steps} steps
						</span>
					)}
				</div>
				{summaryP > 0 && (
					<p className="font-sans text-[12px] text-text-tertiary leading-[1.5] mt-0.5">
						{summary.slice(0, summaryChars)}
						{summaryP < 1 && (
							<span className="inline-block w-[1px] h-[11px] bg-text-tertiary ml-0.5 align-middle animate-blink" />
						)}
					</p>
				)}
			</div>
		</div>
	)
}

function ThinkingDots() {
	return (
		<span className="inline-flex gap-[3px] ml-0.5">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="w-[3px] h-[3px] rounded-full bg-text-tertiary"
					style={{
						animation: 'pulse-dot 1.2s ease-in-out infinite',
						animationDelay: `${i * 0.2}s`,
					}}
				/>
			))}
		</span>
	)
}
