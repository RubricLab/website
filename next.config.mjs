/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'cdn.sanity.io',
				port: '',
				protocol: 'https'
			}
		]
	},
	reactStrictMode: true,
	transpilePackages: [''],
	experimental: {
		serverActions: true
	}
}
export default nextConfig
