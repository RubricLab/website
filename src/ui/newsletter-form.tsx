'use client'

import { joinNewsletter } from '~/app/actions/join-newsletter'
import { Form } from './form'

export const NewsletterForm = () => {
	return (
		<Form action={joinNewsletter}>
			<input placeholder="Email" className="w-full" name="email" type="email" required />
		</Form>
	)
}
