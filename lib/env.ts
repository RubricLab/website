import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export default createEnv({
	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
		NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
		NEXT_PUBLIC_SANITY_PROJECT: z.string().min(1)
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		LOOPS_API_KEY: process.env.LOOPS_API_KEY,
		ROS_SECRET: process.env.ROS_SECRET,
		ROS_API_URL: process.env.ROS_API_URL,
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_SANITY_PROJECT: process.env.NEXT_PUBLIC_SANITY_PROJECT
	},

	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		LOOPS_API_KEY: z.string().min(1),
		ROS_SECRET: z.string().min(1),
		ROS_API_URL: z.string().min(1)
	}
})
