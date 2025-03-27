'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface FoldContextType {
	isBelowFold: boolean
}

const FoldContext = createContext<FoldContextType | null>(null)

export function FoldProvider({ children }: { children: React.ReactNode }) {
	const [isBelowFold, setIsFolded] = useState(false)
	const observerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0]
				if (entry) {
					setIsFolded(!entry.isIntersecting)
				}
			},
			{ threshold: 1.0 }
		)

		if (observerRef.current) {
			observer.observe(observerRef.current)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<FoldContext.Provider value={{ isBelowFold }}>
			<div ref={observerRef} className="pointer-events-none absolute top-0 h-screen w-full" />
			{children}
		</FoldContext.Provider>
	)
}

export function useFold() {
	const context = useContext(FoldContext)
	if (!context) {
		throw new Error('useFold must be used within a FoldProvider')
	}
	return context
}
