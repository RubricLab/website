import {createEnv} from '@t3-oss/env-nextjs'
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
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_SANITY_PROJECT: process.env.NEXT_PUBLIC_SANITY_PROJECT,
		VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA
	},

	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		LOOPS_API_KEY: z.string().min(1),
		VERCEL_GIT_COMMIT_SHA: z.string()
	}
})
