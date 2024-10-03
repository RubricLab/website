import { query } from '@/lib/utils/breakpoints'
import useMedia from 'use-media'

export const useBreakpoint = (breakpoint: keyof typeof query) => {
	const queryString = query[breakpoint]

	if (!queryString) throw new Error(`Invalid breakpoint: ${breakpoint}`)

	return useMedia(queryString)
}
