'use client'

import { Button } from '@rubriclab/ui'
import { createNewsletterSubscriber } from '~/lib/actions/create-newsletter-subscriber'
import { cn } from '~/lib/utils/cn'
import { Form } from '~/ui/form'

export const NewsletterForm = ({ className }: { className?: string }) => {
	return (
		<Form
			label="newsletter"
			action={createNewsletterSubscriber}
			onLoad={{ title: 'Subscribing...' }}
			onSuccess={{
				title: 'Subscribed to newsletter'
			}}
			className={cn(className)}
		>
			{({ pending, state }) => (
				<div className="relative flex w-full items-center">
					<input placeholder="Email" className="w-full" name="email" type="email" required />
					<Button
						label="Subscribe"
						type="submit"
						icon="arrowRight"
						disabled={pending || !!state?.success}
					/>
				</div>
			)}
		</Form>
	)
}
