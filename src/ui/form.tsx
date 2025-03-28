'use client'

import { usePostHog } from 'posthog-js/react'
import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
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
	const formRef = useRef<HTMLFormElement>(null)
	const toastIdRef = useRef<string | number | undefined>(undefined)
	const [state, formAction, pending] = useActionState(action, null)

	useEffect(() => {
		if (pending) toastIdRef.current = toast.loading('Submitting...')
		if (state?.success && toastIdRef.current) {
			toast.success('Successfully submitted!', { id: toastIdRef.current })
			posthog.capture(`${label}_form.submitted`)
			formRef.current?.reset()
		} else if (state?.error && toastIdRef.current) {
			toast.error(state.error, { id: toastIdRef.current })
			posthog.capture(`${label}_form.error`, { error: state.error })
		}
	}, [pending, state, label, posthog])

	return (
		<form
			action={formAction}
			className={cn('flex items-center gap-1', className)}
			ref={ref || formRef}
		>
			{typeof children === 'function' ? children({ pending, state }) : children}
		</form>
	)
}
