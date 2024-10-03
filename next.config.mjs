/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	transpilePackages: ['shiki'],
	images: {
		remotePatterns: [
			{
				hostname: 'cdn.sanity.io',
				port: '',
				protocol: 'https'
			},
			{ hostname: 'assets.basehub.com' },
			{ hostname: 'basehub.earth' }
		]
	}
}
export default nextConfig
