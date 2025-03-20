import { useEffect } from 'react'

type KeyCombo = string | string[]

const shortcuts = new Map<string, Set<(e: KeyboardEvent) => void>>()

function handleKeydown(event: KeyboardEvent) {
	const key = event.key.toLowerCase()
	const meta = event.metaKey
	const shift = event.shiftKey

	// Check all registered shortcuts
	for (const [combo, callbacks] of Array.from(shortcuts.entries())) {
		const parts = combo
			.toLowerCase()
			.split('+')
			.map(k => k.trim())

		const hasMeta = parts.includes('cmd') || parts.includes('meta')
		const hasShift = parts.includes('shift')
		const mainKey = parts.filter(k => !['cmd', 'meta', 'shift'].includes(k))[0]

		if (hasMeta === meta && hasShift === shift && key === mainKey) {
			event.preventDefault()
			for (const callback of Array.from(callbacks)) {
				callback(event)
			}
		}
	}
}

// Initialize global listener
if (typeof document !== 'undefined') {
	document.addEventListener('keydown', handleKeydown)
}

export function useShortcut(keys: KeyCombo, callback: (e: KeyboardEvent) => void) {
	// Normalize keys to array format
	const keyArray = [keys].flat()

	useEffect(() => {
		for (const combo of keyArray) {
			if (!shortcuts.has(combo)) shortcuts.set(combo, new Set())

			shortcuts.get(combo)?.add(callback)
		}

		// Cleanup function to remove callbacks
		return () => {
			for (const combo of keyArray) {
				const callbacks = shortcuts.get(combo)
				if (callbacks) {
					callbacks.delete(callback)
					if (callbacks.size === 0) shortcuts.delete(combo)
				}
			}
		}
	}, [keyArray, callback])
}
