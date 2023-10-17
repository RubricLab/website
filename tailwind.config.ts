import {Config} from 'tailwindcss'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './components/**/*.tsx'],
	theme: {
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
