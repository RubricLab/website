'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { FoldProvider } from '~/lib/hooks/use-fold'
import { PostHogProvider } from '~/lib/posthog/provider'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<PostHogProvider>
			<FoldProvider>
				<Toaster position="bottom-right" />
				{children}
			</FoldProvider>
		</PostHogProvider>
	)
}
