'use client'

import { createContext, useCallback, useContext, useEffect } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from '~/ui/button'
import { ShareIcon } from '~/ui/icons/share'

const FigureIdContext = createContext<string | undefined>(undefined)

const FigureCaption = ({ children }: { children: React.ReactNode }) => {
	return <figcaption className="text-secondary text-sm">{children}</figcaption>
}

const FigureShare = ({ id }: { id?: string }) => {
	const figureId = useContext(FigureIdContext)
	const resolvedId = id ?? figureId
	const { copied, handleCopy } = useClipboard()

	const copyLink = useCallback(() => {
		const hash = resolvedId ? `#${resolvedId}` : ''
		const url = `${window.location.origin}${window.location.pathname}${hash}`
		handleCopy(url)
	}, [handleCopy, resolvedId])

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	return (
		<Button size="sm" variant="icon" onClick={copyLink}>
			<ShareIcon className="h-4 w-4" />
		</Button>
	)
}

const FigureRoot = ({ children, id }: { children: React.ReactNode; id?: string }) => {
	return (
		<FigureIdContext.Provider value={id}>
			<figure id={id} className="flex flex-col items-center gap-1">
				{children}
			</figure>
		</FigureIdContext.Provider>
	)
}

const Figure = Object.assign(FigureRoot, { Caption: FigureCaption, Share: FigureShare })
const Caption = FigureCaption

export { Caption, Figure, FigureCaption, FigureShare }
