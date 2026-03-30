const phases = [
	{
		week: 'Week 0',
		label: 'Fly to SF',
		items: ['meet the team', 'gather context'],
		accent: false
	},
	{
		week: 'Week 1',
		label: 'Embedded Design',
		items: ['whiteboard sessions', 'data model', 'component inventory'],
		accent: true
	},
	{
		week: 'Weeks 2–4',
		label: 'Sprint',
		items: ['daily syncs', 'shared branches', 'integrated deploys'],
		accent: false
	},
	{
		week: '',
		label: 'Production',
		items: ['marketplace live', 'handed off clean'],
		accent: false
	}
]

export function GumloopTimeline() {
	return (
		<figure className="my-10 -mx-2">
			<div className="rounded-xl border border-subtle bg-accent/30 px-5 py-6">
				{/* Timeline */}
				<div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
					{phases.map((phase, i) => (
						<div key={phase.label} className="flex flex-1 items-center">
							<div
								className={`flex w-full flex-col rounded-lg border px-3 py-2.5 ${
									phase.accent
										? 'border-primary/20 bg-primary/[0.04]'
										: 'border-subtle'
								}`}
							>
								{phase.week && (
									<span className="font-mono text-[10px] text-tint">
										{phase.week}
									</span>
								)}
								<span className="font-mono text-xs font-medium text-primary">
									{phase.label}
								</span>
								<div className="mt-1 flex flex-col">
									{phase.items.map(item => (
										<span
											key={item}
											className="font-mono text-[10px] text-secondary/60"
										>
											{item}
										</span>
									))}
								</div>
							</div>
							{i < phases.length - 1 && (
								<span className="hidden shrink-0 px-1.5 font-mono text-[10px] text-secondary/40 sm:block">
									→
								</span>
							)}
						</div>
					))}
				</div>

				{/* Callout */}
				<div className="mt-4 border-t border-subtle pt-3">
					<p className="font-mono text-[10px] text-tint">
						The week in-person transferred more context than a month of Slack threads would
						have.
					</p>
					<p className="mt-1 font-mono text-[10px] text-secondary/50">
						Total time from first meeting to production: one month.
					</p>
				</div>
			</div>
			<figcaption className="mt-2 text-center font-mono text-[11px] text-secondary/60">
				Forward deployment compresses context transfer. Design and build in parallel, not in
				sequence.
			</figcaption>
		</figure>
	)
}
