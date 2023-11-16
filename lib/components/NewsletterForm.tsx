'use client'
import {useEffect} from 'react'
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
	return (
		<Button
			variant='dark'
			type='submit'
			body='Subscribe'
			disabled={pending}
		/>
	)
}

export default function NewsletterForm() {
	const [state, formAction] = useFormState(addSubscriber, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') toast.success(state?.message)
		else if (state?.type === 'error') toast.error(state?.message)
	}, [state])

	return (
		<form
			className='flex w-full flex-col justify-end gap-5'
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
		</form>
	)
}
