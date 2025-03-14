import { redirect } from 'next/navigation'
import { z } from 'zod'
import { env } from '~/lib/env'
import { Button } from '~/ui/button'

const schema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	message: z.string().min(1),
	company: z.string().optional()
})

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ error?: string; success?: boolean }>
}) {
	const { error, success } = await searchParams

	const handleSubmit = async (formData: FormData) => {
		'use server'
		const { data, success, error } = schema.safeParse({
			name: formData.get('name'),
			email: formData.get('email'),
			message: formData.get('message'),
			company: formData.get('company')
		})

		if (!success) {
			const errorMessage = error.issues.map(issue => issue.message).join(', ')
			redirect(`/contact?error=${encodeURIComponent(errorMessage)}`)
		}

		const response = await fetch(`${env.ROS_API_URL}/lead`, {
			method: 'POST',
			body: new URLSearchParams({
				message: data.message,
				email: data.email,
				name: data.name,
				company: data.company || ''
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${env.ROS_SECRET}`
			}
		})

		if (!response.ok) {
			throw new Error('Failed to send message')
		}

		redirect('/contact?success=true')
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-16 py-32">
			<div className="flex w-full max-w-lg flex-col items-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<h1>Contact</h1>
					<p className="text-secondary text-sm">Get in touch with us</p>
				</div>
				<form className="flex w-full flex-col gap-4" action={handleSubmit}>
					<input placeholder="Name" name="name" />
					<input placeholder="Email" name="email" />
					<input placeholder="Company" name="company" />
					<textarea placeholder="Message" name="message" />
					<Button type="submit" className="w-full">
						Send
					</Button>
				</form>
				{error && <div className="text-red-500">{error}</div>}
				{success && <div className="text-green-500">Message sent successfully</div>}
			</div>
		</div>
	)
}
