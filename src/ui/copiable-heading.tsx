'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3'

export const CopiableHeading = ({
	children,
	as: Component = 'h2',
	id: idProp,
	...props
}: { children: React.ReactNode; as?: HeadingLevel } & React.HTMLAttributes<HTMLHeadingElement>) => {
	const fallbackId = children?.toString().toLowerCase().replaceAll(' ', '-')
	const id = idProp ?? fallbackId

	const { copied, handleCopy } = useClipboard()

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	return (
		<Component
			id={id}
			className={cn('group relative cursor-pointer', props.className)}
			onClick={() => (id ? handleCopy(`${window.location.href.split('#')[0]}#${id}`) : null)}
			{...props}
		>
			{children}
		</Component>
	)
}
