'use client'
import Button from './Button'

export default function NewsletterForm() {
	const handleSubscribe = () => {}
	return (
		<div className='flex w-full max-w-sm flex-col justify-end gap-5'>
			<input placeholder='Enter your email' />
			<Button
				body='Subscribe'
				variant='dark'
				onClick={handleSubscribe}
			/>
		</div>
	)
}
