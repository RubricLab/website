'use server'

import { env } from '../env'
import { publish } from '../events/server'
import { executeDemoAgent } from './demo'

export async function sendMessage({ userId, message }: { userId: string; message: string }) {
	await executeDemoAgent({
		messages: [{ content: message, role: 'user' }],
		onEvent: async events => {
			switch (events.type) {
				case 'assistant_message':
					await publish({
						channel: userId,
						eventType: events.type,
						payload: events
					})
			}
		},
		openAIKey: env.OPENAI_API_KEY
	})
}
