import config from '@rubriclab/tailwind-config'
import {Config} from 'tailwindcss'
import {extendedColors as colors, shades} from './lib/utils/colors'

const tailwindConfig = {
	content: ['./app/**/*.tsx', './lib/**/*.tsx'],
	presets: [config],
	theme: {
		fontFamily: {
			sans: ['var(--font-geist-sans)'],
			mono: ['var(--font-geist-mono)'],
			'neue-bit': ['var(--font-neue-bit)']
		},
		extend: {
			colors: {
				transparent: 'transparent',
				shades,
				text: {
					DEFAULT: colors.black,
					secondary: colors.shades[800],
					tertiary: colors.shades[600]
				},
				surface: {
					DEFAULT: colors.white,
					contrast: colors.black
				},
				border: {
					DEFAULT: colors.shades[200]
				},
				control: {
					DEFAULT: colors.black
				},
				error: {
					DEFAULT: '#FF453A'
				},
				success: {
					DEFAULT: '#14C9A2'
				},
				dark: {
					text: {
						DEFAULT: colors.white,
						secondary: colors.shades[200],
						tertiary: colors.shades[400]
					},
					surface: {
						DEFAULT: colors.black,
						contrast: colors.white
					},
					border: {
						DEFAULT: colors.shades[800]
					},
					control: {
						DEFAULT: colors.white
					}
				}
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
