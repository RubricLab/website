import Link from 'next/link'
import { FadeIn } from './fade-in'
import { Section } from './section'

function PillarCard({
	title,
	children,
	footer
}: {
	title: string
	children: React.ReactNode
	footer?: React.ReactNode
}) {
	return (
		<div className="flex h-full flex-col rounded-xl border border-border bg-surface/30 p-8 transition-all duration-300 hover:border-border-hover hover:bg-surface/60">
			<h3 className="mb-8 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
				{title}
			</h3>
			<div className="flex-1 space-y-4 font-sans text-[15px] text-text-secondary leading-relaxed">
				{children}
			</div>
			{footer && <div className="mt-8 border-border border-t pt-6">{footer}</div>}
		</div>
	)
}

export function Pillars() {
	return (
		<Section>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<FadeIn>
					<PillarCard title="Ship">
						<p className="text-text-primary">Production AI for companies that need it done right.</p>
						<p>
							Agents. Memory systems. Generative UI. Fine-tuning. RL. Architecture.
						</p>
						<p>
							Fast onboarding. High-touch. Production-grade. 2–3 engagements per quarter.
						</p>
					</PillarCard>
				</FadeIn>
				<FadeIn delay={0.05}>
					<PillarCard
						title="Research"
						footer={
							<Link
								href="/lab/contract-engineering"
								className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
							>
								<span>Latest: Contract Engineering</span>
								<span className="transition-transform duration-200 group-hover:translate-x-0.5">
									&rarr;
								</span>
							</Link>
						}
					>
						<p className="text-text-primary">We publish what we learn.</p>
						<p>
							Contract engineering. Agent autonomy. Context architecture. Primitives over
							pipelines.
						</p>
						<p>No paywalls. No gated content. Open source.</p>
					</PillarCard>
				</FadeIn>
				<FadeIn delay={0.1}>
					<PillarCard
						title="Build"
						footer={
							<a
								href="https://github.com/rubriclabs"
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
							>
								<span>github.com/rubriclabs</span>
								<span className="transition-transform duration-200 group-hover:translate-x-0.5">
									&rarr;
								</span>
							</a>
						}
					>
						<p className="text-text-primary">We build our own tools.</p>
						<p>
							The problems we hit in client work become the research. The research becomes
							the tools.
						</p>
						<p>
							Maige — codebase copilot. 4,000+ projects.
							<br />
							Autotune — fine-tuning pipeline.
							<br />
							Genson — generative UI from schemas.
						</p>
					</PillarCard>
				</FadeIn>
			</div>
		</Section>
	)
}
