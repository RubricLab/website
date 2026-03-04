import { getBlogSocialImageResponse } from '../social-image'

export const runtime = 'nodejs'
export const revalidate = 86400

type Params = {
	params: Promise<{ slug: string }>
}

export async function GET(_request: Request, { params }: Params) {
	const { slug } = await params
	return getBlogSocialImageResponse(slug)
}
