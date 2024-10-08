'use client'
import { useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import addSubscriber from '~/actions/addSubscriber'
import Button from './Button'
import { toast } from './Toast'

const initialState = {
	type: null,
	message: null
}

function SubscribeButton() {
	const { pending } = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Subscribing...')
	}, [pending])

	return <Button variant="dark" type="submit" body="Subscribe" className="mt-3" disabled={pending} />
}

export default function NewsletterForm({
	audienceCount
}: {
	audienceCount: number
}) {
	const formRef = useRef(null)
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [state, formAction] = useFormState(addSubscriber as any, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			setTimeout(() => (formRef.current as any).reset(), 2 * 1000) // Reset form state
		} else if (state?.type === 'error') toast.error(state?.message)
	}, [state])

	return (
		<form
			ref={formRef}
			className="flex w-full max-w-2xl flex-col justify-end gap-3"
			action={formAction}
		>
			<input type="text" name="name" placeholder="First name" required />
			<input type="text" name="company" placeholder="Company" />
			<input type="email" name="email" placeholder="Email" required />
			<SubscribeButton />
			<p className="text-center text-sm opacity-80">
				Read by {audienceCount} other ambitious builders.
			</p>
		</form>
	)
}
