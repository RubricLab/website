import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	experimental: {
		mdxRs: true
	}
} satisfies NextConfig

const withMDX = createMDX({
	// Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
