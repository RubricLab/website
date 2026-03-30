const tools = [
	'createBooking',
	'deleteBooking',
	'getAvailability',
	'getBookings',
	'sendBookingLink',
	'updateBooking'
]

export function CalAgentLoop() {
	return (
		<figure className="my-10 -mx-2">
			<div className="rounded-xl border border-subtle bg-accent/30 px-5 py-6">
				{/* Main flow */}
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
					{/* Email In */}
					<div className="flex flex-1 flex-col rounded-lg border border-subtle px-3 py-2.5">
						<span className="font-mono text-xs font-medium text-primary">Email In</span>
						<span className="font-mono text-[10px] text-secondary/60">
							parse + DKIM verify
						</span>
					</div>

					<span className="hidden shrink-0 px-1.5 font-mono text-[10px] text-secondary/40 sm:block">
						→
					</span>

					{/* Agent Loop - the centerpiece */}
					<div className="flex flex-[2.5] flex-col rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="font-mono text-xs font-medium text-primary">
								Agent Loop
							</span>
							<span className="font-mono text-[10px] text-secondary/40">
								GPT-4 · temperature 0
							</span>
						</div>

						{/* Inner cycle */}
						<div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-secondary/60">
							<span>understand</span>
							<span className="text-secondary/30">→</span>
							<span>select tool</span>
							<span className="text-secondary/30">→</span>
							<span>execute</span>
							<span className="text-secondary/30">→</span>
							<span>evaluate</span>
							<span className="text-secondary/30">→</span>
							<span className="text-tint">iterate or respond</span>
						</div>

						{/* Tools */}
						<div className="mt-2.5 flex flex-wrap gap-1">
							{tools.map(tool => (
								<span
									key={tool}
									className="rounded border border-subtle px-1.5 py-0.5 font-mono text-[10px] text-secondary"
								>
									{tool}
								</span>
							))}
						</div>
						<span className="mt-1.5 font-mono text-[10px] text-secondary/40">
							each tool: Zod schema → validated input → Cal.com API
						</span>
					</div>

					<span className="hidden shrink-0 px-1.5 font-mono text-[10px] text-secondary/40 sm:block">
						→
					</span>

					{/* Email Out */}
					<div className="flex flex-1 flex-col rounded-lg border border-subtle px-3 py-2.5">
						<span className="font-mono text-xs font-medium text-primary">
							Email Out
						</span>
						<span className="font-mono text-[10px] text-secondary/60">
							confirmation or error
						</span>
					</div>
				</div>

				{/* Key annotations */}
				<div className="mt-4 flex flex-col gap-1.5 border-t border-subtle pt-3 sm:flex-row sm:gap-4">
					<span className="font-mono text-[10px] text-secondary/50">
						<span className="text-tint">API keys</span> injected into tools, never
						visible to agent
					</span>
					<span className="font-mono text-[10px] text-secondary/50">
						<span className="text-tint">No UI</span> — the agent must get it right on the
						first try
					</span>
				</div>
			</div>
			<figcaption className="mt-2 text-center font-mono text-[11px] text-secondary/60">
				An email-only agent loop with typed tool interfaces. No sandbox mode for someone's
				Tuesday afternoon.
			</figcaption>
		</figure>
	)
}
