import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.tsx'],
	darkMode: 'class',
	theme: {
		extend: {
			borderRadius: {
				custom: '5rem'
			}
		}
	}
} satisfies Config
