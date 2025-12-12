import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.tsx'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				radius: {
					custom: '5rem'
				}
			}
		}
	}
} satisfies Config
