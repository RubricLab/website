import { createBlock } from '@rubriclab/blocks'
import { z } from 'zod/v4'
import { Stats } from '~/ui/demo/blocks/stats'

export const stats = createBlock({
	description: 'Stats block',
	render: ({ statistic, subtitle, title }) => {
		return <Stats data={{ statistic, subtitle, title }} />
	},
	schema: {
		input: z.object({
			statistic: z.number(),
			subtitle: z.string(),
			title: z.string()
		})
	}
})
