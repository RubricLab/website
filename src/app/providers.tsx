'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<>
			<Toaster position="bottom-right" />
			{children}
		</>
	)
}
