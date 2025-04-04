'use client'

import type { ReactNode } from 'react'
import { FoldProvider } from '~/lib/hooks/use-fold'
import { PostHogProvider } from '~/lib/posthog/provider'
import { Toaster } from '~/ui/toaster'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<PostHogProvider>
			<FoldProvider>
				<Toaster />
				{children}
			</FoldProvider>
		</PostHogProvider>
	)
}
