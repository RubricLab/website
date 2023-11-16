'use server'
import {z} from 'zod'
import slackClient from '~/utils/slackClient'

const schema = z.object({
	message: z.string(),
	email: z.string(),
	name: z.string()
})

// Send contact request to Slack
export default async function sendContactRequest(
	prevState: any,
	formData: FormData
) {
	const parsed = schema.parse({
		message: formData.get('message'),
		email: formData.get('email'),
		name: formData.get('name')
	})

	// Send Slack message
	const response = await slackClient.chat.postMessage({
		channel: 'C05AQKAJL9X',
		text: `From: ${parsed.name}\nEmail: ${parsed.email}\n${parsed.message}\n`
	})

	// Return response

	if (response.ok) return {message: `Request submitted`, type: 'success'}
	return {message: 'Unexpected error', type: 'error'}
}
