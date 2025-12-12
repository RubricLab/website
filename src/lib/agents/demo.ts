import { createAgent } from '@rubriclab/agents'

const { executeAgent, eventTypes, __ToolEvent, __ResponseEvent } = createAgent({
	model: 'gpt-5-mini',
	systemPrompt: 'You are a demo agent',
	tools: {}
})

export { executeAgent as executeDemoAgent, eventTypes as demoAgentEventTypes }

export type DemoAgentToolEvent = typeof __ToolEvent
export type DemoAgentResponseEvent = typeof __ResponseEvent
