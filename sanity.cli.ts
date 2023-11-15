import {defineCliConfig} from 'sanity/cli'
import env from '~/env.mjs'

export default defineCliConfig({
	api: {
		dataset: env.NEXT_PUBLIC_SANITY_DATASET,
		projectId: env.NEXT_PUBLIC_SANITY_PROJECT
	}
})
