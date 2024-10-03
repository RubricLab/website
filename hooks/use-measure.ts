import useMeasurePrimitive, { type Options } from 'react-use-measure'
import { ResizeObserver } from '@juggle/resize-observer'
import { RESIZE_DEBOUNCE } from '@/lib/utils/constants'

export const useMeasure = (config?: Options) =>
	useMeasurePrimitive({ debounce: RESIZE_DEBOUNCE, polyfill: ResizeObserver, ...config })

useMeasure.create = (elm: HTMLElement, cb: (bounds: DOMRect) => void) => {
	const observer = new ResizeObserver(entries => {
		for (const entry of entries)
			if (entry.target === elm) {
				const bounds = entry.target.getBoundingClientRect()
				cb(bounds)
			}
	})

	observer.observe(elm)

	return () => {
		observer.unobserve(elm)
		observer.disconnect()
	}
}
