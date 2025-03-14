import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
	client: {},
	runtimeEnv: {
		ROS_API_URL: process.env.ROS_API_URL,
		ROS_SECRET: process.env.ROS_SECRET,
		VERCEL_URL: process.env.VERCEL_URL
	},
	server: {
		ROS_API_URL: z.string().min(1),
		ROS_SECRET: z.string().min(1),
		VERCEL_URL: z.string().min(1)
	}
})
