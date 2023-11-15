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
	reactStrictMode: true
}
export default nextConfig
