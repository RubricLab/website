const steps = [
	{ label: 'GitHub API', sub: 'commits, PRs, languages' },
	{ label: 'GPT-4 Turbo', sub: 'scene selection + ordering', accent: true },
	{ label: 'Video Manifest', sub: '12 scenes as JSON' },
	{ label: 'Remotion', sub: 'React → frames' },
	{ label: 'Lambda', sub: 'parallel encode → mp4' }
]

export function YicFlow() {
	return (
		<figure className="my-10 -mx-2">
			<div className="rounded-xl border border-subtle bg-accent/30 px-5 py-6">
				{/* Annotation row */}
				<div className="mb-4 flex justify-center gap-12 font-mono text-[10px] uppercase tracking-[0.15em]">
					<span className="text-tint">AI decides what</span>
					<span className="text-tint">Code decides how</span>
				</div>

				{/* Pipeline */}
				<div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0">
					{steps.map((step, i) => (
						<div key={step.label} className="flex flex-1 items-center">
							<div
								className={`flex w-full flex-col rounded-lg border px-3 py-2.5 ${
									step.accent
										? 'border-primary/20 bg-primary/[0.04]'
										: 'border-subtle'
								}`}
							>
								<span
									className={`font-mono text-xs font-medium ${
										step.accent ? 'text-primary' : 'text-primary'
									}`}
								>
									{step.label}
								</span>
								<span className="font-mono text-[10px] text-secondary/60">
									{step.sub}
								</span>
							</div>
							{i < steps.length - 1 && (
								<span className="hidden shrink-0 px-1.5 font-mono text-[10px] text-secondary/40 sm:block">
									→
								</span>
							)}
						</div>
					))}
				</div>

				{/* Bracket annotations */}
				<div className="mt-3 hidden sm:flex">
					<div className="flex flex-[2] justify-center">
						<div className="flex flex-col items-center">
							<div className="h-2 w-[80%] border-x border-b border-secondary/20" />
							<span className="mt-1 font-mono text-[10px] text-tint">
								editorial decisions
							</span>
						</div>
					</div>
					<div className="flex flex-[3] justify-center">
						<div className="flex flex-col items-center">
							<div className="h-2 w-[80%] border-x border-b border-secondary/20" />
							<span className="mt-1 font-mono text-[10px] text-tint">
								deterministic rendering
							</span>
						</div>
					</div>
				</div>
			</div>
			<figcaption className="mt-2 text-center font-mono text-[11px] text-secondary/60">
				The AI directs. The code renders. Every video is unique, every frame is predictable.
			</figcaption>
		</figure>
	)
}
