'use client'
import {useEffect, useRef} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import sendContactRequest from '~/actions/sendContactRequest'
import copyToClipboard from '~/utils/copyToClipboard'
import Button from './Button'
import {toast} from './Toast'

const initialState = {
	type: null,
	message: null
}

function SubmitButton() {
	const {pending} = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Submitting...')
	}, [pending])

	return (
		<Button
			variant='dark'
			type='submit'
			body='Submit'
			disabled={pending}
		/>
	)
}

export default function ContactForm() {
	const formRef = useRef(null)
	const [state, formAction] = useFormState(sendContactRequest, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setTimeout(() => formRef.current.reset(), 2 * 1000) // Reset form state
		} else if (state?.type === 'error') toast.error(state?.message)
	}, [state])

	return (
		<div className='flex w-full max-w-md flex-col gap-4'>
			<form
				ref={formRef}
				className='flex w-full flex-col gap-8'
				action={formAction}>
				<div className='flex flex-col gap-4'>
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
						required
					/>
					<input
						type='email'
						name='email'
						placeholder='Email'
						required
					/>
					<textarea
						placeholder='Message'
						name='message'
						required
						maxLength={300}
					/>
				</div>
				<SubmitButton />
			</form>
			<p className='text-center text-sm'>
				or email us at{' '}
				<button
					className='font-semibold underline underline-offset-4 hover:opacity-80'
					onClick={() => copyToClipboard('hello@rubriclabs.com')}>
					hello@rubriclabs.com
				</button>
			</p>
		</div>
	)
}
