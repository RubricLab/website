const loopSteps = [
	{ label: 'Decompose', sub: 'break intent into constraints' },
	{ label: 'Retrieve', sub: 'targeted catalog queries' },
	{ label: 'Inspect', sub: 'evaluate result quality' },
	{ label: 'Decide', sub: 'refine or respond', accent: true }
]

export function SafewaySearchLoop() {
	return (
		<figure className="my-10 -mx-2">
			<div className="rounded-xl border border-subtle bg-accent/30 px-5 py-6">
				{/* Loop steps */}
				<div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
					{loopSteps.map((step, i) => (
						<div key={step.label} className="flex flex-1 items-center">
							<div
								className={`flex w-full flex-col rounded-lg border px-3 py-2.5 ${
									step.accent
										? 'border-primary/20 bg-primary/[0.04]'
										: 'border-subtle'
								}`}
							>
								<span className="font-mono text-xs font-medium text-primary">
									{step.label}
								</span>
								<span className="font-mono text-[10px] text-secondary/60">
									{step.sub}
								</span>
							</div>
							{i < loopSteps.length - 1 && (
								<span className="hidden shrink-0 px-1.5 font-mono text-[10px] text-secondary/40 sm:block">
									→
								</span>
							)}
						</div>
					))}
				</div>

				{/* Refine loop arrow */}
				<div className="mt-3 hidden sm:flex sm:justify-end sm:pr-[12%]">
					<div className="flex items-center gap-1.5 font-mono text-[10px] text-secondary/40">
						<span>↩ refine</span>
						<span className="text-secondary/25">|</span>
						<span className="text-tint">↓ respond</span>
					</div>
				</div>

				{/* Termination condition */}
				<div className="mt-3 rounded border border-subtle px-3 py-2">
					<span className="font-mono text-[10px] text-tint">Termination: </span>
					<span className="font-mono text-[10px] text-secondary/60">
						3 passes without improvement → respond with best results + explain limitation
					</span>
				</div>
			</div>
			<figcaption className="mt-2 text-center font-mono text-[11px] text-secondary/60">
				The agent evaluates its own results. Different questions produce different retrieval
				strategies.
			</figcaption>
		</figure>
	)
}
