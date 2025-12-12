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
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: true,
	transpilePackages: [
		'@rubriclab/actions',
		'@rubriclab/agents',
		'@rubriclab/blocks',
		'@rubriclab/events',
		'@rubriclab/ui'
	]
} satisfies NextConfig

const withMDX = createMDX({
	extension: /\.mdx?$/,
	options: {
		rehypePlugins: [[rehypePrettyCode, rehypeOptions]]
	}
})

export default withMDX(nextConfig)
