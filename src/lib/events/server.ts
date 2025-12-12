import { createEventsServer } from '@rubriclab/events/server'
import { env } from '~/lib/env'
import { eventTypes } from './types'

export const { publish, GET, maxDuration } = createEventsServer({
	eventTypes,
	redisURL: env.UPSTASH_REDIS_URL
})
