import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: true
}

const withMDX = createMDX({
	extension: /\.mdx?$/
	// Note: rehype/remark plugins are not supported with Turbopack in Next.js 16
	// due to serialization requirements. Syntax highlighting can be implemented
	// using client-side libraries or by waiting for Turbopack plugin support.
})

export default withMDX(nextConfig)
