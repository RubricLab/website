'use client'

export function ChatInput({ text, fillProgress, submitted }: {
	text?: string
	fillProgress?: number
	submitted?: boolean
}) {
	const fill = fillProgress ?? 0
	const chars = text ? Math.floor(fill * text.length) : 0
	const showText = text && fill > 0 && !submitted
	const displayText = showText ? text.slice(0, chars) : null

	return (
		<div className="flex items-center gap-3 bg-accent/40 rounded-2xl px-3.5 py-2.5" style={{
			opacity: submitted ? 0.5 : 1,
			transition: 'opacity 0.3s',
		}}>
			{displayText ? (
				<span className="text-[13px] text-primary flex-1">
					{displayText}
					{fill < 1 && <span className="inline-block w-px h-3 bg-secondary ml-0.5 align-middle animate-blink" />}
				</span>
			) : (
				<span className="text-[13px] text-secondary/60 flex-1">
					{submitted ? '' : 'Ask Rubric something...'}
				</span>
			)}
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-secondary/40" style={{
				transform: fill >= 1 && !submitted ? 'rotate(90deg)' : 'none',
				transition: 'transform 0.2s',
				opacity: fill >= 1 && !submitted ? 0.8 : 0.4,
			}}>
				<path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	)
}
