'use client'

import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'

/**
 * A block with a polished copy icon in the top-right corner.
 * Pass `copyContent` for what goes to clipboard (can differ from displayed content).
 */
export const CopyBlock = ({
	children,
	copyContent,
	className,
}: {
	children: React.ReactNode
	copyContent: string
	className?: string
}) => {
	const { copied, handleCopy } = useClipboard()

	return (
		<div className={cn('relative group', className)}>
			{children}
			<button
				type="button"
				onClick={() => handleCopy(copyContent)}
				className={cn(
					'absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-md cursor-pointer transition-all duration-200',
					copied
						? 'opacity-100 bg-tint/10'
						: 'opacity-0 group-hover:opacity-100 hover:bg-primary/10'
				)}
				title={copied ? 'Copied' : 'Copy'}
			>
				{copied ? (
					<svg className="h-3 w-3 text-tint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
						<title>Copied</title>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				) : (
					<svg className="h-3 w-3 text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<title>Copy</title>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
					</svg>
				)}
			</button>
		</div>
	)
}
