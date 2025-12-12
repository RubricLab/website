import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
	client: {
		NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1)
	},
	runtimeEnv: {
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NODE_ENV: process.env.NODE_ENV,
		ROS_API_URL: process.env.ROS_API_URL,
		ROS_SECRET: process.env.ROS_SECRET,
		URL: process.env.URL
	},
	server: {
		NODE_ENV: z.string().min(1),
		ROS_API_URL: z.string().min(1),
		ROS_SECRET: z.string().min(1),
		URL: z.string().min(1)
	}
})
