'use client'

import { useEffect, useRef } from 'react'

export const HorizontalScroll = ({ children }: { children: React.ReactNode }) => {
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handler = (e: WheelEvent) => {
			if (!scrollRef.current) return

			// This looks odd but it's hard to simplify
			if (scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - window.innerWidth)
				e.preventDefault()

			if (scrollRef.current.scrollTop === 0) {
				scrollRef.current.scrollBy({ left: e.deltaY })
			} else if (scrollRef.current.scrollTop > 0) {
				e.preventDefault()
				scrollRef.current.scrollBy({ top: e.deltaY })
			}
		}

		scrollRef.current?.addEventListener('wheel', handler)

		return () => {
			scrollRef.current?.removeEventListener('wheel', handler)
		}
	}, [])

	return (
		<div ref={scrollRef} className="flex h-screen w-screen overflow-scroll overscroll-contain">
			{children}
		</div>
	)
}
