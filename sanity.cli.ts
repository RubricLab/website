import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
	api: {
		dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
		projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT
	}
})
