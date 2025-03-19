'use client'

import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Link } from './icons/link'

type HeadingLevel = 'h1' | 'h2' | 'h3'

const iconSizes = {
	h1: 'h-8',
	h2: 'h-6',
	h3: 'h-4'
}

export const CopiableHeading = ({
	children,
	as: Component = 'h2',
	...props
}: { children: React.ReactNode; as?: HeadingLevel } & React.HTMLAttributes<HTMLHeadingElement>) => {
	const id = children?.toString().toLowerCase().replace(/ /g, '-')

	const { copied, handleCopy } = useClipboard()

	return (
		<Component id={id} className="group relative" {...props}>
			{children}
			<Button
				size="sm"
				variant="icon"
				onClick={() => handleCopy(`${window.location.href.split('#')[0]}#${id}`)}
				className="-translate-x-full -translate-y-1/2 -left-2 absolute top-1/2 opacity-0 transition-opacity group-hover:opacity-100"
			>
				{copied ? (
					<Checkmark className={iconSizes[Component]} />
				) : (
					<Link className={iconSizes[Component]} />
				)}
			</Button>
		</Component>
	)
}
