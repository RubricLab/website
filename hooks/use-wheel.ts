/* wheel hook that receives a callback and passes the delta value */

import { useEffect, useRef } from 'react'

export const useWheel = (
  onChange: ({
    event,
    deltaY,
    deltaX
  }: {
    event: WheelEvent
    deltaY: number
    deltaX: number
  }) => void,
  elm: React.RefObject<HTMLElement>
) => {
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  useEffect(() => {
    const trgt = elm.current || window
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      onChangeRef.current?.({
        event,
        deltaY: event.deltaY,
        deltaX: event.deltaX
      })
    }

    trgt.addEventListener('wheel', handleWheel)

    return () => {
      trgt.removeEventListener('wheel', handleWheel)
    }
  }, [elm])
}
