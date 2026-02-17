import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Handle /blog/[slug]/s/[section] pattern for social sharing
	// This allows section-specific OG images while keeping clean hash URLs for users
	const sectionMatch = pathname.match(/^\/blog\/([^/]+)\/s\/(.+)$/)
	if (sectionMatch) {
		const slug = sectionMatch[1]
		const section = sectionMatch[2]
		if (slug && section) {
			const url = request.nextUrl.clone()
			url.pathname = `/blog/${slug}`
			url.searchParams.set('section', section)
			return NextResponse.rewrite(url)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/blog/:slug/s/:section*']
}
