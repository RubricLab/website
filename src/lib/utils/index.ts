import { env } from '~/lib/env'

export const getBaseUrl = () => {
	const host = env.VERCEL_URL ?? env.URL
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}
