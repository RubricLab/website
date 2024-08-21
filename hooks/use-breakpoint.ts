import {useEffect, useState} from 'react'
import {Breakpoint, breakpoints} from '../lib/utils/breakpoints'
import useWindowSize from './use-window-size'

function useBreakpoint(): Breakpoint {
  const {width} = useWindowSize()
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm')

  useEffect(() => {
    const determineBreakpoint = () => {
      const breakpointEntries = Object.entries(breakpoints) as [
        Breakpoint,
        (typeof breakpoints)[Breakpoint]
      ][]
      const currentBreakpoint = breakpointEntries.find(
        ([_, {min, max}]) => width >= min && width <= max
      )

      if (currentBreakpoint) setBreakpoint(currentBreakpoint[0])
    }

    determineBreakpoint()
  }, [width])

  return breakpoint
}

export default useBreakpoint
