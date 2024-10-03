import { useEffect, useState } from 'react'

export function useLoaded(): boolean {
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		if (typeof window !== 'undefined')
			if (document.readyState === 'complete') setLoaded(true)
			else {
				const handleLoad = () => setLoaded(true)
				window.addEventListener('load', handleLoad)
				return () => window.removeEventListener('load', handleLoad)
			}
		return
	}, [])

	return loaded
}
