'use server'

import { z } from 'zod'
import { env } from '~/lib/env'

const schema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	message: z.string().min(1).max(1000),
	company: z.string().optional()
})

export async function submitContact(_: unknown, formData: FormData) {
	const { data, success, error } = schema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		message: formData.get('message'),
		company: formData.get('company')
	})

	if (!success) {
		const errorMessage = error.issues.map(issue => issue.message).join(', ')
		return { error: errorMessage }
	}

	try {
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
			return { error: 'Failed to send message' }
		}

		return { success: true }
	} catch (error) {
		return { error: 'Failed to send message' }
	}
}
