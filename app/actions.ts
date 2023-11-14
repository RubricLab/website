import {loopsClient as loops} from '../lib/utils'

// Create subscriber in Loops
export async function addSubscriber(
	name: string,
	company: string,
	email: string
): Promise<{type: 'success' | 'error'; message: string}> {
	// Get response
	const response = await loops.createContact(email, {
		firstName: name,
		company: company,
		source: 'Website'
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
