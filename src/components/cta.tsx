import Link from 'next/link'

export function CTA() {
	return (
		<section className="border-border/50 border-t">
			<div className="mx-auto max-w-[1200px] px-6 py-32 text-center md:px-10 md:py-40">
				<p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
					Get in touch
				</p>
				<h2 className="mx-auto mt-6 max-w-[600px] font-normal font-sans text-[clamp(28px,4vw,40px)] text-text-primary leading-tight tracking-tight">
					Working on something hard?
				</h2>
				<p className="mx-auto mt-4 max-w-[440px] font-sans text-base text-text-secondary leading-relaxed">
					We take on a small number of engagements. Tell us what you're building.
				</p>
				<Link
					href="/contact"
					className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 font-mono text-[13px] text-text-primary transition-all duration-300 hover:border-border-hover hover:bg-surface"
				>
					<span>Start a conversation</span>
					<span className="transition-transform duration-200 group-hover:translate-x-0.5">
						&rarr;
					</span>
				</Link>
			</div>
		</section>
	)
}
