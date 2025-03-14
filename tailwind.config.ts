import config from '@rubriclab/config/tailwind'
import type { Config } from 'tailwindcss'

export default {
	darkMode: 'class',
	content: ['./src/**/*.tsx'],
	presets: [config],
	theme: {
		colors: {
			...config.theme.colors
		}
	}
} satisfies Config
