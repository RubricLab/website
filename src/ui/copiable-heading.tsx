'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3'

// TODO: remove this component in favour of <Copiable /
export const CopiableHeading = ({
	children,
	as: Component = 'h2',
	...props
}: { children: React.ReactNode; as?: HeadingLevel } & React.HTMLAttributes<HTMLHeadingElement>) => {
	const id = children?.toString().toLowerCase().replace(/ /g, '-')

	const { copied, handleCopy } = useClipboard()

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	return (
		<Component
			id={id}
			className={cn('group relative cursor-pointer', props.className)}
			onClick={() => handleCopy(`${window.location.href.split('#')[0]}#${id}`)}
			{...props}
		>
			{children}
		</Component>
	)
}
