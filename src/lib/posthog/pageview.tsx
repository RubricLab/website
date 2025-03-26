'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'

// Since Next.js acts as a single-page app, this event doesn't trigger on navigation
// and we need to capture $pageview events manually.
// See: https://posthog.com/docs/libraries/next-js#capturing-pageviews
const PostHogPageView = (): null => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const posthog = usePostHog()

	// Track pageviews
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname
			if (searchParams.toString()) {
				url = `${url}?${searchParams.toString()}`
			}
			posthog.capture('$pageview', { $current_url: url })
		}
	}, [pathname, searchParams, posthog])

	return null
}

// Wrap this in Suspense to avoid the `useSearchParams` usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
const SuspendedPostHogPageView = () => {
	return (
		<Suspense fallback={null}>
			<PostHogPageView />
		</Suspense>
	)
}

export default SuspendedPostHogPageView
