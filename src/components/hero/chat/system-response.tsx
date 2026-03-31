'use client'

export function SystemResponse({ text, progress }: { text: string; progress: number }) {
	if (progress <= 0) return null
	const words = text.split(' ')
	const count = Math.floor(progress * words.length)
	const isTyping = progress < 1

	return (
		<p className="text-[13px] text-primary leading-[1.65]">
			{words.slice(0, count).join(' ')}
			{isTyping && <span className="inline-block w-px h-3 bg-secondary ml-0.5 align-middle animate-blink" />}
		</p>
	)
}
