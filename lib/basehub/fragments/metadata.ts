import { fragmentOn } from 'basehub'

export const metadataOverridesFragment = fragmentOn('MetadataOverridesComponent', {
	title: true,
	description: true
})

export type MetadataOverridesFragment = fragmentOn.infer<typeof metadataOverridesFragment>
