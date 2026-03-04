import { env } from '~/lib/env'

export const getBaseUrl = () => {
	const host = env.URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
	if (!host) throw new Error('Missing URL configuration')
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}
