'use server'
import {z} from 'zod'
import loops from '~/utils/loopsClient'

const schema = z.object({
	company: z.string().optional(),
	email: z.string(),
	name: z.string()
})

// Create subscriber in Loops
export default async function addSubscriber(
	prevState: any,
	formData: FormData
) {
	const parsed = schema.parse({
		company: formData.get('company'),
		email: formData.get('email'),
		name: formData.get('name')
	})

	// Get response
	const response = await loops.createContact(parsed.email, {
		company: parsed.company,
		firstName: parsed.name,
		source: 'Website',
		userGroup: 'Newsletter'
	})

	// Return response
	if (response.success)
		return {message: `Successfully subscribed ${parsed.email}`, type: 'success'}
	else if ('message' in response)
		return {
			message: response.message,
			type: 'error'
		}
	else return {message: 'Unexpected error', type: 'error'}
}
