import Link from 'next/link'

export function CTA() {
	return (
		<section className="py-[160px] text-center">
			<div className="mx-auto max-w-[1200px] px-6 md:px-8">
				<h2 className="font-sans text-[32px] text-primary font-normal">
					Working on something hard?
				</h2>
				<p className="font-sans text-lg text-secondary mt-4 max-w-[480px] mx-auto leading-relaxed">
					We take on a small number of engagements.
					Tell us what you're building.
				</p>
				<Link
					href="/contact"
					className="inline-block font-mono text-sm text-primary mt-8 hover:underline transition-all duration-150"
				>
					Start a conversation →
				</Link>
			</div>
		</section>
	)
}
