'use client'

export interface Tool {
	name: string
	time: string
}

export function ToolCalls({
	tools,
	progress,
}: {
	tools: Tool[]
	progress: number
}) {
	if (progress <= 0) return null

	return (
		<div className="flex flex-wrap gap-1.5">
			{tools.map((tool, i) => {
				const threshold = i / tools.length
				const toolP = Math.min(1, Math.max(0, (progress - threshold) * tools.length))
				if (toolP <= 0) return null

				const isComplete = toolP > 0.5

				return (
					<div
						key={tool.name}
						className="flex items-center gap-1.5 bg-accent-soft border border-border rounded-full px-2.5 py-1"
						style={{
							opacity: Math.min(1, toolP * 2),
							transform: `scale(${0.96 + toolP * 0.04})`,
						}}
					>
						<span className="font-sans text-[11px] text-text-primary">
							{tool.name}
						</span>
						{isComplete && (
							<span className="font-sans text-[10px] text-text-tertiary">
								{tool.time}
							</span>
						)}
						{isComplete && (
							<span className="text-accent text-[10px]">✓</span>
						)}
					</div>
				)
			})}
		</div>
	)
}
