import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'

const rehypeOptions = {
	keepBackground: false,
	theme: {
		// To view themes: shiki.style/themes#themes
		dark: 'github-dark-dimmed',
		light: 'github-light'
	}
}

const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['md', 'mdx', 'ts', 'tsx']
} satisfies NextConfig

const withMDX = createMDX({
	extension: /\.mdx?$/,
	options: {
		rehypePlugins: [[rehypePrettyCode, rehypeOptions]]
	}
})

export default withMDX(nextConfig)
