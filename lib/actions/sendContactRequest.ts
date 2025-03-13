'use server'

import env from '@/lib/env'
import { z } from 'zod'

const schema = z.object({
	message: z.string(),
	email: z.string(),
	name: z.string(),
	company: z.string()
})

// Send contact request to Slack
export default async function sendContactRequest(
	formData: FormData
): Promise<{ message: string; type: 'success' | 'error' }> {
	const parsed = schema.parse({
		message: formData.get('message'),
		email: formData.get('email'),
		name: formData.get('name'),
		company: formData.get('company')
	})

	if (!parsed.name || !parsed.email || !parsed.message)
		return { message: 'Missing required information', type: 'error' }

	try {
		// Submit formData to Ros API
		const externalResponse = await fetch(env.ROS_API_URL, {
			method: 'POST',
			body: new URLSearchParams({
				message: parsed.message,
				email: parsed.email,
				name: parsed.name,
				company: parsed.company
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${env.ROS_SECRET}`
			}
		})

		if (externalResponse.ok) return { message: 'Request submitted', type: 'success' }

		const errorBody = (await externalResponse.text()) || 'Could not submit request'

		return { message: errorBody, type: 'error' }
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: `Unexpected error: ${JSON.stringify(err)}`,
			type: 'error'
		}
	}
}
