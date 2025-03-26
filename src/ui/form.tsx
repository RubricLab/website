'use client'

import { usePostHog } from 'posthog-js/react'
import { useActionState, useEffect } from 'react'
import { cn } from '~/lib/utils/cn'

type ActionResult =
	| {
			error: string
			success?: never
	  }
	| {
			success: boolean
			error?: never
	  }

type Action = (state: ActionResult | null, payload: FormData) => Promise<ActionResult>

export const Form = ({
	label,
	action,
	children,
	ref,
	className
}: {
	label: string
	action: Action
	children:
		| React.ReactNode
		| ((props: { pending: boolean; state: ActionResult | null }) => React.ReactNode)
	className?: string
	ref?: React.RefObject<HTMLFormElement | null>
}) => {
	const posthog = usePostHog()
	const [state, formAction, pending] = useActionState(action, null)

	useEffect(() => {
		if (state?.success) posthog.capture(`${label}_form.submitted`)
		if (state?.error) posthog.capture(`${label}_form.error`, { error: state.error })
	}, [state, label, posthog])

	return (
		<form action={formAction} className={cn('flex items-center gap-1', className)} ref={ref}>
			{typeof children === 'function' ? children({ pending, state }) : children}
		</form>
	)
}
