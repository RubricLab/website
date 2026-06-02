import { DemoSection } from './demo-row'

// Shows the three landing-page iterations side by side. Each iteration is the
// exact self-contained HTML artifact, iframed at a mobile viewport so readers
// see the real page and can scroll it.
export const LandingDemoSection = ({ bare = false }: { bare?: boolean }) => {
	return (
		<DemoSection
			bare={bare}
			id="landing"
			title="1 · The purple-hell landing page"
			blurb="The one-shot baseline, a mid de-slop pass, and the final polished page. Scroll each frame."
			columns={[
				{
					body: (
						<IterationFrame
							src="/iterative-improvement/landing/iter-0.html"
							title="Landing page — iteration 0 (one-shot)"
						/>
					),
					caption: 'one-shot',
					label: 'Iteration 0'
				},
				{
					body: (
						<IterationFrame
							src="/iterative-improvement/landing/iter-2.html"
							title="Landing page — iteration 2 (de-slopped)"
						/>
					),
					caption: 'de-slopped',
					label: 'Iteration 2'
				},
				{
					body: (
						<IterationFrame
							src="/iterative-improvement/landing/iter-3.html"
							title="Landing page — iteration 3 (polished)"
						/>
					),
					caption: 'polished',
					label: 'Iteration 3'
				}
			]}
		/>
	)
}

const IterationFrame = ({ src, title }: { src: string; title: string }) => (
	<iframe
		src={src}
		title={title}
		loading="lazy"
		className="h-[560px] w-full rounded-lg border border-subtle bg-white"
	/>
)
