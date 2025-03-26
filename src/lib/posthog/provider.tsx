'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { env } from '~/lib/env'
import PostHogPageView from './pageview'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
			capture_pageview: false, // Disable automatic pageview capture, as we capture manually
			capture_pageleave: true // Enable pageleave capture
		})
	}, [])

	return (
		<PHProvider client={posthog}>
			<PostHogPageView />
			{children}
		</PHProvider>
	)
}
