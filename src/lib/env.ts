import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
	client: {
		NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1)
	},
	runtimeEnv: {
		ROS_API_URL: process.env.ROS_API_URL,
		ROS_SECRET: process.env.ROS_SECRET,
		VERCEL_URL: process.env.VERCEL_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST
	},
	server: {
		ROS_API_URL: z.string().min(1),
		ROS_SECRET: z.string().min(1),
		VERCEL_URL: z.string().min(1),
		NODE_ENV: z.string().min(1)
	}
})
