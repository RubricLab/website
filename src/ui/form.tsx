'use client'

import { useActionState } from 'react'
import { Button } from './button'
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
	action,
	children,
	className,
	successText = 'Submitted',
	pendingText = 'Submitting...',
	ctaText = 'Submit'
}: {
	action: Action
	children:
		| React.ReactNode
		| ((props: { pending: boolean; state: ActionResult | null }) => React.ReactNode)
	className?: string
	successText?: string
	pendingText?: string
	ctaText?: string
}) => {
	const [state, formAction, pending] = useActionState(action, null)

	return (
		<form action={formAction} className={cn('flex items-center gap-1', className)}>
			{typeof children === 'function' ? children({ pending, state }) : children}
			<Button type="submit" disabled={pending || !!state?.success} className="w-full">
				{pending ? pendingText : state?.success ? successText : ctaText}
			</Button>
		</form>
	)
}
