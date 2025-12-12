import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: true
}

const withMDX = createMDX({
	extension: /\.mdx?$/
	// Note: Syntax highlighting is implemented client-side using Shiki in the CodeBlock component
	// to avoid Turbopack serialization issues with rehype/remark plugins at build time.
})

export default withMDX(nextConfig)
