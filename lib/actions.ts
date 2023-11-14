'use server'
import {z} from 'zod'
import {loopsClient as loops} from './utils'

const schema = z.object({
	name: z.string(),
	company: z.string(),
	email: z.string()
})

// Create subscriber in Loops
export async function addSubscriber(
	formData: FormData
): Promise<{type: 'success' | 'error'; message: string}> {
	const parsed = schema.parse({
		name: formData.get('name'),
		company: formData.get('company'),
		email: formData.get('email')
	})

	// Get response
	const response = await loops.createContact(parsed.email, {
		firstName: parsed.name,
		company: parsed.company,
		source: 'Website',
		userGroup: 'Newsletter'
	})

	// Return response
	if (response.success)
		return {type: 'success', message: 'Subscribed to newsletter'}
	else if ('message' in response)
		return {
			type: 'error',
			message: response.message
		}
	else return {type: 'error', message: 'Unexpected error'}
}
