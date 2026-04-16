import Link from 'next/link'
import { Button } from '~/components/button'
import { Arrow } from '~/components/icons/arrow'

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
				<div className="mt-8 flex justify-center gap-3">
					<Button asChild intent="primary" size="lg" trailingIcon={<Arrow />}>
						<Link href="/contact">Start a conversation</Link>
					</Button>
					<Button asChild intent="secondary" size="lg">
						<Link href="/work">Browse work</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}
