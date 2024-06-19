'use server'

import {z} from 'zod'
import {ROS} from '~/constants/ros'
import env from '~/env.mjs'

const schema = z.object({
	message: z.string(),
	email: z.string(),
	name: z.string(),
	company: z.string()
})

// Send contact request to Slack
export default async function sendContactRequest(
	prevState: any,
	formData: FormData
) {
	const parsed = schema.parse({
		message: formData.get('message'),
		email: formData.get('email'),
		name: formData.get('name'),
		company: formData.get('company')
	})

	if (!parsed.name || !parsed.email || !parsed.message)
		return {message: `Missing required information`, type: 'error'}

	try {
		// Submit formData to Ros API
		const externalResponse = await fetch(ROS.api.leads, {
			method: 'POST',
			body: new URLSearchParams({
				message: parsed.message,
				email: parsed.email,
				name: parsed.name,
				company: parsed.company
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				API_KEY: env.ROS_API_KEY
			}
		})

		// Return response
		if (externalResponse.ok)
			return {message: `Request submitted`, type: 'success'}
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
