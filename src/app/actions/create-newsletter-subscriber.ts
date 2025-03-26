'use server'

import { z } from 'zod'
import { env } from '~/lib/env'

const schema = z.object({
	email: z.string().email()
})

export async function createNewsletterSubscriber(_: unknown, formData: FormData) {
	try {
		const result = schema.safeParse({ email: formData.get('email') })

		if (!result.success) return { error: 'Invalid email' }

		const { email } = result.data

		if (!email) return { error: 'Email is required' }

		const res = await fetch(`${env.ROS_API_URL}/newsletter`, {
			method: 'POST',
			body: new URLSearchParams({ email }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${env.ROS_SECRET}`
			}
		})

		if (!res.ok) return { error: 'Failed to join newsletter' }

		return { success: true }
	} catch (err) {
		return { error: (err as Error).message || 'Unexpected error' }
	}
}
