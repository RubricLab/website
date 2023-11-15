import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './lib/**/*.tsx'],
	presets: [config],
	theme: {
		colors: {
			...config.theme.colors
		},
		extend: {
			colors: {
				teal: '#A8CFCF'
			},
			fontFamily: {
				'neue-bit': ['var(--font-neue-bit)']
			}
		}
	}
} satisfies Config

export default tailwindConfig
