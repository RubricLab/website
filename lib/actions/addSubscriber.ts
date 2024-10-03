'use server'
import { z } from 'zod'
import loops from '~/utils/loopsClient'

const schema = z.object({
	company: z.string().optional(),
	email: z.string(),
	name: z.string()
})

// Create subscriber in Loops
export default async function addSubscriber(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	_: any,
	formData: FormData
) {
	const parsed = schema.parse({
		company: formData.get('company'),
		email: formData.get('email'),
		name: formData.get('name')
	})

	// Get response
	const response = await loops.createContact(parsed.email, {
		company: parsed.company || null,
		firstName: parsed.name,
		source: 'Website',
		userGroup: 'Newsletter'
	})

	// Return response
	if (response.success)
		return {
			message: `Successfully subscribed ${parsed.email}`,
			type: 'success'
		}
	if ('message' in response)
		return {
			message: response.message,
			type: 'error'
		}
	return { message: 'Unexpected error', type: 'error' }
}
