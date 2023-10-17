import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schemas from './sanity/schema'

// Sanity config file
const config = defineConfig({
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
	basePath: '/studio', // URL at which Sanity studio will be hosted
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	plugins: [deskTool(), visionTool()],
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
	schema: {types: schemas},
	title: 'Rubric CMS'
})

export default config
