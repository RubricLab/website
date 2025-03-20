'use client'

import { joinNewsletter } from '~/app/actions/join-newsletter'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Form } from '~/ui/form'
import { Arrow } from '~/ui/icons/arrow'
import { Checkmark } from '~/ui/icons/checkmark'

export const NewsletterForm = ({ className }: { className?: string }) => {
	return (
		<Form action={joinNewsletter} className={cn(className)}>
			{({ pending, state }) => (
				<div className="relative flex w-full items-center">
					<input placeholder="Email" className="w-full" name="email" type="email" required />
					<Button
						type="submit"
						disabled={pending || !!state?.success}
						variant="icon"
						className="-translate-y-1/2 absolute top-1/2 right-2"
					>
						{pending ? (
							<span className="w-4">...</span>
						) : state?.success ? (
							<Checkmark className="h-5 w-5" />
						) : (
							<Arrow className="h-5 w-5" />
						)}
					</Button>
				</div>
			)}
		</Form>
	)
}
