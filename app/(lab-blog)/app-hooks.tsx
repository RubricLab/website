'use client'

import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

export const AppHooks = () => {
	useBodyHeightChange()
	useUserIsTabbing()
	return <></>
}

const useUserIsTabbing = () => {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.code === 'Tab') document.body.classList.add('user-is-tabbing')
		}

		function handleMouseDown() {
			document.body.classList.remove('user-is-tabbing')
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('mousedown', handleMouseDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('mousedown', handleMouseDown)
		}
	}, [])
}

const useBodyHeightChange = () => {
	useEffect(() => {
		function logBodyHeight() {
			console.log(`Body height changed: ${document.body.clientHeight}px`)
		}

		// Create a ResizeObserver to observe changes to the body element
		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries)
				if (entry.target === document.body) {
					logBodyHeight()
					ScrollTrigger.refresh()
				}
		})

		// Start observing the body element
		resizeObserver.observe(document.body)

		return () => {
			resizeObserver.disconnect()
		}
	}, [])
}
