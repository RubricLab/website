import useMeasurePrimitive, { Options } from 'react-use-measure'
import { ResizeObserver } from '@juggle/resize-observer'
import { RESIZE_DEBOUNCE } from '@/lib/utils/constants'

export const useMeasure = (config?: Options) => useMeasurePrimitive({ debounce: RESIZE_DEBOUNCE, polyfill: ResizeObserver, ...config })