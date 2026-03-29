'use client'

/**
 * Decorative chat input field at the bottom of the chat panel.
 */
export function ChatInput({ opacity = 1 }: { opacity?: number }) {
	return (
		<div
			className="border-t border-border pt-3"
			style={{ opacity }}
		>
			<div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-3.5 py-2.5">
				<span className="font-sans text-[13px] text-text-tertiary flex-1">
					Ask Rubric something...
				</span>
				<div className="w-6 h-6 rounded-lg bg-accent-soft flex items-center justify-center">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
						<path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="var(--text-tertiary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			</div>
		</div>
	)
}
