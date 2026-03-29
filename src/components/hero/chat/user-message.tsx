'use client'

export function UserMessage({
	text,
	progress,
}: {
	text: string
	progress: number
}) {
	if (progress <= 0) return null

	const chars = Math.floor(progress * text.length)
	const displayed = text.slice(0, chars)
	const isTyping = progress < 1

	return (
		<div className="flex justify-end">
			<div className="max-w-[85%]">
				<div className="bg-surface border border-border rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
					<p className="font-sans text-[13px] text-text-primary leading-[1.55]">
						{displayed}
						{isTyping && (
							<span className="inline-block w-[1.5px] h-[13px] bg-text-tertiary ml-0.5 align-middle animate-blink" />
						)}
					</p>
				</div>
			</div>
		</div>
	)
}
