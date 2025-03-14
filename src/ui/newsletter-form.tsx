'use client'

import { joinNewsletter } from '~/app/actions/join-newsletter'
import { Button } from './button'
import { useActionState } from 'react'

export const NewsletterForm = () => {
	const [state, formAction, pending] = useActionState(joinNewsletter, null)

	return (
		<form action={formAction} className="flex items-center gap-1">
			<input placeholder="Email" name="email" type="email" required />
			<Button type="submit" disabled={pending || !!state?.success}>
				{pending ? 'Subscribing...' : state?.success ? 'Subscribed' : 'Subscribe'}
			</Button>
		</form>
	)
}
