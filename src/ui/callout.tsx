import type { PropsWithChildren } from 'react'

export function Callout({ children }: PropsWithChildren) {
	return (
		<div className="my-6 rounded-xl border border-secondary/50 bg-subtle px-4 py-3">{children}</div>
	)
}
