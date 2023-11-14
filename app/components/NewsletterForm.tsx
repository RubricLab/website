'use client'
import {FormEvent, useState} from 'react'
import {addSubscriber} from '../actions'
import Button from './Button'
import {toast} from './Toast'

export default function NewsletterForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [name, setName] = useState('')
	const [company, setCompany] = useState('')
	const [email, setEmail] = useState('')

	// Handle newsletter subscription
	async function handleSubscribe(e: FormEvent) {
		e.preventDefault()
		try {
			setIsLoading(true)
			const {type, message} = await addSubscriber(name, company, email)
			if (type === 'error') toast.error(message)
			else toast.success(message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form
			className='flex w-full flex-col justify-end gap-5'
			onSubmit={handleSubscribe}>
			<input
				onChange={e => setName(e.target.value)}
				value={name}
				type='text'
				name='name'
				placeholder='First name'
				required
			/>
			<input
				onChange={e => setCompany(e.target.value)}
				value={company}
				type='text'
				name='company'
				placeholder='Company'
				required
			/>
			<input
				onChange={e => setEmail(e.target.value)}
				value={email}
				type='text'
				name='email'
				placeholder='Email'
				required
			/>
			<Button
				variant='dark'
				type='submit'
				disabled={isLoading}
				body='Subsrcibe'
			/>
		</form>
	)
}
