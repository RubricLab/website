'use client'

import type { ReactNode } from 'react'
import { PostHogProvider } from '~/lib/posthog/provider'

export default function Providers({ children }: { children: ReactNode }) {
	return <PostHogProvider>{children}</PostHogProvider>
}
