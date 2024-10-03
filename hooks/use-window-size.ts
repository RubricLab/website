import { RESIZE_DEBOUNCE } from '@/lib/utils/constants'
import debounce from 'debounce'
import { useEffect, useState } from 'react'

interface WindowSize {
	width: number | undefined
	height: number | undefined
}

function useWindowSize(): WindowSize {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: undefined,
		height: undefined
	})

	useEffect(() => {
		function handleResize() {
			if (typeof window !== 'undefined')
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight
				})
		}

		const debouncedHandleResize = debounce(handleResize, RESIZE_DEBOUNCE)

		window.addEventListener('resize', debouncedHandleResize, { passive: true })

		// Call handler right away so state gets updated with initial window size
		handleResize()

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', debouncedHandleResize)
	}, []) // Empty array ensures that effect is only run on mount and unmount

	return windowSize
}

export default useWindowSize
