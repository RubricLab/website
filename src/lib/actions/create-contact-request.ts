'use server'

import { z } from 'zod'
import { env } from '~/lib/env'
import { getClientIpAddress } from '../utils/api'

const schema = z.object({
	company: z.string().optional(),
	email: z.string().email(),
	message: z.string().min(1).max(1000),
	name: z.string().min(1)
})

export async function createContactRequest(_: unknown, formData: FormData) {
	try {
		const { data, success, error } = schema.safeParse({
			company: formData.get('company'),
			email: formData.get('email'),
			message: formData.get('message'),
			name: formData.get('name')
		})

		if (!success) {
			const errorMessage = error.issues
				.map(issue => `${issue.message}: ${issue.path.join('.')}`)
				.join(', ')
			return { error: errorMessage }
		}

		const ipAddress = await getClientIpAddress()

		const response = await fetch(`${env.ROS_API_URL}/lead`, {
			body: new URLSearchParams({
				company: data.company || '',
				email: data.email,
				ip: ipAddress || 'unknown',
				message: data.message,
				name: data.name
			}),
			headers: {
				Authorization: `Bearer ${env.ROS_SECRET}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		})

		if (!response.ok) {
			return { error: 'Failed to send message' }
		}

		return { success: true }
	} catch (_error) {
		return { error: 'Failed to send message' }
	}
}
