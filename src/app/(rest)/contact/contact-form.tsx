'use client'

import { Button } from '@rubriclab/ui'
import { useRef } from 'react'
import { createContactRequest } from '~/lib/actions/create-contact-request'
import { useShortcut } from '~/lib/hooks/use-shortcut'
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
				description: 'We will get back to you as soon as possible',
				title: 'Request submitted'
			}}
			className="flex w-full flex-col gap-4"
		>
			{({ pending, state }) => (
				<>
					<div className="flex min-h-56 w-full flex-col items-center justify-center text-center">
						<div className="flex w-full flex-col gap-2">
							{/* biome-ignore lint/a11y/noAutofocus: techdebt */}
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
					<Button type="submit" disabled={pending || !!state?.success} label="Submit ⌘+⏎" />
				</>
			)}
		</Form>
	)
}
