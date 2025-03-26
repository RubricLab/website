'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { PostHogProvider } from '~/lib/posthog/provider'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<PostHogProvider>
			<Toaster position="bottom-right" />
			{children}
		</PostHogProvider>
	)
}
