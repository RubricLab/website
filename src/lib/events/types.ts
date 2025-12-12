import { createEventTypes } from '@rubriclab/events'
import { demoAgentEventTypes } from '~/lib/agents/demo'

export const eventTypes = createEventTypes({
	...demoAgentEventTypes
})
