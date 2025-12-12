import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: true
}

const withMDX = createMDX({
	extension: /\.mdx?$/
	// TODO: Re-enable syntax highlighting once Turbopack supports non-serializable
	// rehype/remark plugins. Consider using client-side syntax highlighting libraries
	// like Prism.js or Shiki as an alternative.
	// Previous config used: rehypePlugins: [[rehypePrettyCode, { keepBackground: false, theme: { dark: 'github-dark-dimmed', light: 'github-light' }}]]
})

export default withMDX(nextConfig)
