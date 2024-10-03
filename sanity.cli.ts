import env from '@/lib/env'
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
	api: {
		dataset: env.NEXT_PUBLIC_SANITY_DATASET,
		projectId: env.NEXT_PUBLIC_SANITY_PROJECT
	}
})
