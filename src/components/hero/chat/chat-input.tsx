'use client'

export function ChatInput() {
	return (
		<div className="flex items-center gap-3 bg-accent/40 rounded-2xl px-3.5 py-2.5">
			<span className="text-[13px] text-secondary/60 flex-1">Ask Rubric something...</span>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-secondary/40">
				<path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	)
}
