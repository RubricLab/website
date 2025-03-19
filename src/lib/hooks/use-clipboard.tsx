import { useState } from 'react'
import { TIMEOUT } from '~/lib/constants'
import { copy } from '~/lib/utils/copy'

export function useClipboard() {
	const [copied, setCopied] = useState(false)

	const handleCopy = (text: string) => {
		copy(text)
		setCopied(true)
		setTimeout(() => setCopied(false), TIMEOUT)
	}

	return { copied, handleCopy }
}
