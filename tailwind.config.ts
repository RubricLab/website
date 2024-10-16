import config from '@rubriclab/config/tailwind'
import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import toemPlugin from 'toem-tailwind-plugin'
import { shades } from './lib/utils/colors'

const generateColumnValues = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	count: any
) => {
	return Object.fromEntries(
		[...Array(count)].map((_, i) => [`col-${i + 1}`, `calc(var(--col-width) * ${i + 1})`])
	)
}

const columnConfig = generateColumnValues(12)

const tailwindConfig: Config = {
	darkMode: 'class',
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./common/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,ts,jsx,tsx,mdx}'
	],
	presets: [config],
	theme: {
		fontFamily: {
			sans: ['var(--font-geist-sans)'],
			mono: ['var(--font-geist-mono)'],
			'neue-bit': ['var(--font-neue-bit)']
		},
		extend: {
			zIndex: {
				header: '999',
				menu: '998',
				overlay: '997'
			},
			colors: {
				transparent: 'transparent',
				shades,
				text: {
					DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
					tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
					contrast: 'rgb(var(--color-text-contrast) / <alpha-value>)'
				},
				surface: {
					DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
					secondary: 'rgb(var(--color-surface-secondary) / <alpha-value>)',
					tertiary: 'rgb(var(--color-surface-tertiary) / <alpha-value>)',
					contrast: 'rgb(var(--color-surface-contrast) / <alpha-value>)'
				},
				background: 'color-mix(in srgb, var(--background) calc(<alpha-value> * 100%), transparent)',
				foreground: 'color-mix(in srgb, var(--foreground) calc(<alpha-value> * 100%), transparent)',
				border: {
					DEFAULT: 'rgb(var(--color-border) / <alpha-value>)'
				},
				control: {
					DEFAULT: 'rgb(var(--color-control) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: '#873225'
				},
				success: {
					DEFAULT: 'rgb(var(--color-success) / <alpha-value>)'
				}
			},
			spacing: {
				...columnConfig,
				sides: 'var(--spacing-sides)',
				header: 'var(--header-height)',
				fold: 'var(--fold-height)'
			},
			fontSize: {
				'blog-body': [
					'1.05em',
					{
						lineHeight: '1.5',
						letterSpacing: '-0.002em'
					}
				]
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		typography,
		toemPlugin({
			/* Optional */
			defaultBase: 16 /* Default value is: 16 */,
			autoBase: true /* Default value is: true */
		}),
		plugin(({ addVariant }) => {
			addVariant('tab-focus-within', ':is(.user-is-tabbing &):focus-within')
		})
	]
}

export default tailwindConfig
