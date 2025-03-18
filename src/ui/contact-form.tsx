'use client'

import { submitContact } from '~/app/actions/submit-contact'
import { Form } from './form'

export const ContactForm = () => {
	return (
		<Form action={submitContact} className="flex w-full flex-col gap-4">
			{({ pending, state }) => (
				<div className="flex min-h-56 w-full flex-col items-center justify-center gap-1 text-center">
					{state?.error ? (
						<p className="text-red-500 text-sm">{state.error}</p>
					) : pending || state?.success ? (
						<p className={`text-sm ${state?.success ? 'text-green-500' : 'text-secondary'}`}>
							Thanks. We'll be in touch soon.
						</p>
					) : (
						<div className="flex w-full flex-col gap-2">
							<input placeholder="Name" name="name" />
							<input placeholder="Email" name="email" />
							<input placeholder="Company" name="company" />
							<textarea placeholder="Message" name="message" />
						</div>
					)}
				</div>
			)}
		</Form>
	)
}
