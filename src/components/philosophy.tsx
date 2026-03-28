import Link from 'next/link'
import { FadeIn } from './fade-in'
import { Section } from './section'

export function Philosophy() {
	return (
		<Section>
			<div className="mx-auto max-w-[720px] text-center">
				<FadeIn>
					<p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Philosophy
					</p>
				</FadeIn>
				<FadeIn delay={0.1}>
					<h2 className="mt-6 font-normal font-sans text-[clamp(28px,5vw,48px)] text-text-primary leading-tight tracking-tight">
						Primitives over Pipelines
					</h2>
				</FadeIn>
				<FadeIn delay={0.15}>
					<p className="mx-auto mt-6 max-w-[520px] font-sans text-lg text-text-secondary leading-relaxed">
						Give agents modular functions instead of prescriptive workflows. Let the
						model decide how to compose them. Build less scaffolding, get more
						capability.
					</p>
				</FadeIn>
				<FadeIn delay={0.2}>
					<Link
						href="/lab/primitives-over-pipelines"
						className="group mt-8 inline-flex items-center gap-2 font-mono text-[13px] text-text-tertiary transition-colors duration-200 hover:text-text-primary"
					>
						<span>Read the essay</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							&rarr;
						</span>
					</Link>
				</FadeIn>
			</div>
		</Section>
	)
}
