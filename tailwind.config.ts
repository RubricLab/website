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
			},
			keyframes: {
				'accordion-down': {
					from: {height: '0'},
					to: {height: 'var(--radix-accordion-content-height)'}
				},
				'accordion-up': {
					from: {height: 'var(--radix-accordion-content-height)'},
					to: {height: '0'}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	}
} satisfies Config

export default tailwindConfig
