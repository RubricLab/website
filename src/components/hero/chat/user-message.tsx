'use client'

export function UserMessage({ text, progress }: { text: string; progress: number }) {
	if (progress <= 0) return null
	const chars = Math.floor(progress * text.length)
	const isTyping = progress < 1

	return (
		<div className="flex justify-end">
			<div className="bg-accent/60 rounded-2xl rounded-br-sm px-4 py-2.5">
				<p className="text-[13px] text-primary leading-relaxed">
					{text.slice(0, chars)}
					{isTyping && <span className="inline-block w-px h-3 bg-secondary ml-0.5 align-middle animate-blink" />}
				</p>
			</div>
		</div>
	)
}
