import OGImage from './opengraph-image'

export const runtime = 'nodejs'
export { alt, contentType, size } from './opengraph-image'

export default async function Response() {
	return OGImage()
}
