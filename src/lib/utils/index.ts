import { env } from '~/lib/env'

export const getBaseUrl = () => {
	return `http${env.NODE_ENV === 'production' ? 's' : ''}://${env.URL}`
}
