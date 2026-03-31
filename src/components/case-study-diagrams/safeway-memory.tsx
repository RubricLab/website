export function SafewayMemory() {
	return (
		<figure className="my-10 -mx-2">
			<div className="rounded-xl border border-subtle bg-accent/30 px-5 py-6">
				{/* Session Memory */}
				<div className="rounded-lg border border-subtle px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="font-mono text-[10px] uppercase tracking-[0.15em] text-tint">
							Session Memory
						</span>
						<span className="font-mono text-[10px] text-secondary/40">ephemeral</span>
					</div>
					<div className="mt-2 flex flex-wrap gap-1.5">
						{['retrievals', 'recommendations', 'rejections', 'refined queries'].map(
							item => (
								<span
									key={item}
									className="rounded border border-subtle px-2 py-0.5 font-mono text-[10px] text-secondary"
								>
									{item}
								</span>
							)
						)}
					</div>
					<p className="mt-2 font-mono text-[10px] text-secondary/50">
						&ldquo;not that one, something cheaper&rdquo; → filters its own history, doesn&apos;t
						re-retrieve
					</p>
				</div>

				{/* Classification arrow */}
				<div className="flex flex-col items-center py-3">
					<span className="font-mono text-[10px] text-tint">↓ classify &amp; promote</span>
					<span className="font-mono text-[10px] text-secondary/40">
						durable preference? → persist
					</span>
				</div>

				{/* Cross-Session Memory */}
				<div className="rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="font-mono text-[10px] uppercase tracking-[0.15em] text-tint">
							Cross-Session Memory
						</span>
						<span className="font-mono text-[10px] text-secondary/40">durable</span>
					</div>
					<div className="mt-2 flex flex-wrap gap-1.5">
						{[
							'nut allergy',
							'prefers organic',
							'household: 4',
							'brand: Safeway Select'
						].map(item => (
							<span
								key={item}
								className="rounded border border-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary/80"
							>
								{item}
							</span>
						))}
					</div>
					<p className="mt-2 font-mono text-[10px] text-secondary/50">
						Next session starts with context already loaded. The agent doesn&apos;t ask
						questions it&apos;s already answered.
					</p>
				</div>

				{/* Annotation */}
				<div className="mt-4 border-t border-subtle pt-3">
					<p className="font-mono text-[10px] text-tint">
						Not an append-only log — structured, scoped, selective. The classification
						layer decides what to store and at what scope.
					</p>
				</div>
			</div>
			<figcaption className="mt-2 text-center font-mono text-[11px] text-secondary/60">
				Two-layer memory with explicit retention policies. Most agent frameworks treat memory
				as a log. That breaks at scale.
			</figcaption>
		</figure>
	)
}
