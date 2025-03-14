'use client'

import { ArrowRightIcon, LoaderIcon } from 'lucide-react'
import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import sendContactRequest from '~/actions/sendContactRequest'
import copyToClipboard from '~/utils/copyToClipboard'
import Button from './Button'
import { toast } from './Toast'

function SubmitButton() {
	const { pending } = useFormStatus()

	return (
		<Button
			variant="dark"
			type="submit"
			body="Submit"
			disabled={pending}
			icon={
				pending ? (
					<LoaderIcon className="h-4 w-4 animate-pulse" />
				) : (
					<ArrowRightIcon className="font-neue-bit transition-all duration-300 group-hover:translate-x-1.5 group-disabled:translate-x-0" />
				)
			}
		/>
	)
}

export default function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null)

	const handleSubmit = async (formData: FormData) => {
		const { message, type } = await sendContactRequest(formData)
		if (type === 'success') {
			toast.success(message)
			setTimeout(() => formRef.current?.reset(), 2 * 1000)
		}
		if (type === 'error') toast.error(message)
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<form ref={formRef} className="flex w-full flex-col gap-8" action={handleSubmit}>
				<div className="flex flex-col gap-4">
					<input type="text" name="name" placeholder="First name" required />
					<input type="text" name="company" placeholder="Company" required />
					<input type="email" name="email" placeholder="Email" required />
					<textarea placeholder="Message" name="message" required maxLength={300} />
				</div>
				<SubmitButton />
			</form>
			<p className="text-center text-sm">
				or email us at{' '}
				<button
					type="button"
					className="font-semibold underline underline-offset-4 hover:opacity-80"
					onClick={() => copyToClipboard('hello@rubriclabs.com')}
				>
					hello@rubriclabs.com
				</button>
			</p>
		</div>
	)
}
