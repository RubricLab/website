'use client'

export function SystemResponse({
	text,
	progress,
}: {
	text: string
	progress: number
}) {
	if (progress <= 0) return null

	const words = text.split(' ')
	const visibleCount = Math.floor(progress * words.length)
	const displayed = words.slice(0, visibleCount).join(' ')
	const isTyping = progress < 1

	return (
		<div className="max-w-[95%]">
			<p className="font-sans text-[13px] text-text-primary leading-[1.65]">
				{displayed}
				{isTyping && (
					<span className="inline-block w-[1.5px] h-[13px] bg-text-tertiary ml-0.5 align-middle animate-blink" />
				)}
			</p>
		</div>
	)
}
