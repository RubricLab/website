'use client'

import { useRef } from 'react'
import { submitContact } from '~/app/actions/submit-contact'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { Button } from '~/ui/button'
import { Form } from '~/ui/form'

export const ContactForm = () => {
	const formRef = useRef<HTMLFormElement>(null)

	useShortcut('cmd+enter', () => formRef.current?.requestSubmit(), { fireInForm: true })

	return (
		<Form action={submitContact} ref={formRef} className="flex w-full flex-col gap-4">
			{({ pending, state }) => (
				<>
					<div className="flex min-h-56 w-full flex-col items-center justify-center text-center">
						{state?.success ? (
							<p>Thanks. We'll be in touch soon.</p>
						) : (
							<div className="flex w-full flex-col gap-2">
								{/* biome-ignore lint/a11y/noAutofocus: <explanation> */}
								<input autoFocus placeholder="Name" name="name" required />
								<input placeholder="Email" name="email" required />
								<input placeholder="Company" name="company" required />
								<textarea placeholder="Message" name="message" required className="resize-none" />
							</div>
						)}
					</div>
					<Button type="submit" disabled={pending || !!state?.success} className="w-full">
						{pending ? 'Submitting...' : state?.success ? 'Submitted' : 'Submit'}
						<div className="ml-auto flex items-center gap-0.5">
							<kbd>⌘</kbd>
							<kbd>⏎</kbd>
						</div>
					</Button>
					<p className="h-5 text-danger text-sm">{state?.error || ''}</p>
				</>
			)}
		</Form>
	)
}
