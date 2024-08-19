import config from '@rubriclab/tailwind-config'
import typography from '@tailwindcss/typography'
import {Config} from 'tailwindcss'
import toemPlugin from 'toem-tailwind-plugin'
import {shades} from './lib/utils/colors'

const generateColumnValues = count => {
  return Object.fromEntries(
    [...Array(count)].map((_, i) => [
      `col-${i + 1}`,
      `calc(var(--col-width) * ${i + 1})`
    ])
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
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)'
        },
        control: {
          DEFAULT: 'rgb(var(--color-control) / <alpha-value>)'
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)'
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)'
        }
      },
      spacing: {
        ...columnConfig,
        sides: 'var(--spacing-sides)',
        header: 'var(--header-height)',
        fold: 'calc(100vw - var(--header-height))'
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
  },
  plugins: [
    typography,
    toemPlugin({
      /* Optional */
      defaultBase: 16 /* Default value is: 16 */,
      autoBase: true /* Default value is: true */
    })
  ]
}

export default tailwindConfig
