'use client'

import { createNewsletterSubscriber } from '~/app/actions/create-newsletter-subscriber'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Form } from '~/ui/form'
import { Arrow } from '~/ui/icons/arrow'

export const NewsletterForm = ({ className }: { className?: string }) => {
	return (
		<Form label="newsletter" action={createNewsletterSubscriber} className={cn(className)}>
			{({ pending, state }) => (
				<div className="relative flex w-full items-center">
					<input placeholder="Email" className="w-full" name="email" type="email" required />
					<Button
						type="submit"
						disabled={pending || !!state?.success}
						variant="icon"
						className="-translate-y-1/2 absolute top-1/2 right-2"
					>
						<Arrow className="h-5 w-5" />
					</Button>
				</div>
			)}
		</Form>
	)
}
