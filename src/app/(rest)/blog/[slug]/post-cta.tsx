'use client'

import { NewsletterForm } from '~/app/(rest)/newsletter/newsletter-form'

export const PostCTA = () => {
	return (
		<section className="mt-8 flex w-full flex-col border-subtle border-t pt-8">
			<div className="flex flex-col gap-4">
				<p className="text-secondary">
					This post is written by Rubric Labs, an applied AI lab helping companies build intelligent
					applications.
				</p>
				<p className="text-secondary leading-snug">
					You can subscribe to our newsletter for new posts, or get in touch if you want to work
					together.
				</p>
				<NewsletterForm className="w-full sm:max-w-sm" />
			</div>
		</section>
	)
}
