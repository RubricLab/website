'use server'
import {z} from 'zod'
import notionClient from '~/utils/notionClient'
import slackClient from '~/utils/slackClient'

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

	// Create page in Notion
	const notionResponse = await notionClient.pages.create({
		parent: {
			database_id: process.env.NOTION_PAGE_ID
		},
		icon: {type: 'emoji', emoji: '🏄‍♀'},
		children: [
			{
				type: 'heading_3',
				heading_3: {
					rich_text: [{type: 'text', text: {content: 'Message from client'}}]
				}
			},
			{
				type: 'quote',
				quote: {rich_text: [{type: 'text', text: {content: parsed.message}}]}
			}
		],
		properties: {
			Name: {
				type: 'title',
				title: [
					{
						type: 'text',
						text: {
							content: parsed.name
						}
					}
				]
			},
			Email: {
				type: 'email',
				email: parsed.email
			},
			Status: {
				type: 'select',
				select: {name: 'Lead'}
			},
			Source: {
				type: 'select',
				select: {name: 'Website'}
			},
			Company: {
				type: 'rich_text',
				rich_text: [{type: 'text', text: {content: parsed.company}}]
			}
		}
	})

	const restructuredName = parsed.name.replace(/\s+/g, '-') // Convert "First Name" to "First-Name"
	const notionPageUrl = `https://notion.so/rubric/${restructuredName}-${notionResponse.id}`

	// // Send message to Slack
	const slackResponse = await slackClient.chat.postMessage({
		channel: 'C05AQKAJL9X',
		text: `New lead \n\n${parsed.name}, ${parsed.company}, ${parsed.email} \n\n${parsed.message} \n\nLink to Notion: ${notionPageUrl}`
	})

	// Return response
	if (slackResponse.ok) return {message: `Request submitted`, type: 'success'}
	return {message: 'Unexpected error', type: 'error'}
}
