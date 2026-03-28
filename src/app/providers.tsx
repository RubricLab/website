'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '~/lib/theme'
import { PostHogProvider } from '~/lib/posthog/provider'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<PostHogProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</PostHogProvider>
	)
}
