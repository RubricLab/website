'use client'
import {useEffect, useRef} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import addSubscriber from '~/actions/addSubscriber'
import Button from './Button'
import {toast} from './Toast'

const initialState = {
	type: null,
	message: null
}

function SubscribeButton() {
	const {pending} = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Subscribing...')
	}, [pending])

	return (
		<Button
			variant='dark'
			type='submit'
			body='Subscribe'
			className='mt-3'
			disabled={pending}
		/>
	)
}

export default function NewsletterForm() {
	const formRef = useRef(null)
	const [state, formAction] = useFormState(addSubscriber, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setTimeout(() => formRef.current.reset(), 2 * 1000) // Reset form state
		} else if (state?.type === 'error') toast.error(state?.message)
	}, [state])

	return (
		<form
			ref={formRef}
			className='flex w-full flex-col justify-end gap-3'
			action={formAction}>
			<input
				type='text'
				name='name'
				placeholder='First name'
				required
			/>
			<input
				type='text'
				name='company'
				placeholder='Company'
			/>
			<input
				type='email'
				name='email'
				placeholder='Email'
				required
			/>
			<SubscribeButton />
			<p className='text-center text-sm opacity-80'>
				Read by 41 other ambitious builders.
			</p>
		</form>
	)
}
