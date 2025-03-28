'use client'

import { useRef } from 'react'
import { createContactRequest } from '~/app/actions/create-contact-request'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { Button } from '~/ui/button'
import { Form } from '~/ui/form'

export const ContactForm = () => {
	const formRef = useRef<HTMLFormElement>(null)

	useShortcut('cmd+enter', () => formRef.current?.requestSubmit(), { fireInForm: true })
	return (
		<Form
			label="contact"
			action={createContactRequest}
			ref={formRef}
			onLoad={{ title: 'Submitting...' }}
			onSuccess={{
				title: 'Request submitted',
				description: 'We will get back to you as soon as possible'
			}}
			className="flex w-full flex-col gap-4"
		>
			{({ pending, state }) => (
				<>
					<div className="flex min-h-56 w-full flex-col items-center justify-center text-center">
						<div className="flex w-full flex-col gap-2">
							{/* biome-ignore lint/a11y/noAutofocus: <explanation> */}
							<input autoFocus placeholder="Name" name="name" type="text" required />
							<input placeholder="Email" name="email" type="email" required />
							<input placeholder="Company" name="company" type="text" required />
							<textarea
								placeholder="Message"
								name="message"
								required
								className="resize-none"
								maxLength={300}
							/>
						</div>
					</div>
					<Button type="submit" disabled={pending || !!state?.success} className="w-full">
						<p>Submit</p>
						<div className="ml-auto flex items-center gap-0.5">
							<kbd>⌘</kbd>
							<kbd>⏎</kbd>
						</div>
					</Button>
				</>
			)}
		</Form>
	)
}
