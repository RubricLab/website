import { headers } from 'next/headers'

export async function getClientIpAddress(): Promise<string | null> {
	const headersList = await headers()
	
	// Try x-forwarded-for first (used by Vercel and most proxies)
	const forwardedFor = headersList.get('x-forwarded-for')
	if (forwardedFor) {
		// x-forwarded-for can contain multiple IPs, the first one is the client IP
		return forwardedFor.split(',')[0]?.trim() ?? null
	}
	
	// Try x-real-ip (used by some proxies)
	const realIp = headersList.get('x-real-ip')
	if (realIp) {
		return realIp
	}
	
	// Fallback to other common headers
	return headersList.get('cf-connecting-ip') || null
}