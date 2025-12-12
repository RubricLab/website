import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const rehypeOptions = {
	keepBackground: false,
	theme: {
		// To view themes: shiki.style/themes#themes
		dark: 'github-dark-dimmed',
		light: 'github-light'
	}
}

const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: true
} satisfies NextConfig

const withMDX = createMDX({
	extension: /\.(mdx)$/,
	options: {
		rehypePlugins: [['rehype-pretty-code', rehypeOptions]]
	}
})

export default withMDX(nextConfig)
