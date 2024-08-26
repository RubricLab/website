import {RefObject, useEffect, useRef, useState} from 'react'

interface MousePosition {
  x: number
  y: number
}

interface UseMousePositionResult extends MousePosition {
  isHovering: boolean
}

interface UseMousePositionOptions {
  elementRef?: RefObject<HTMLElement>
  disabled?: boolean
}

function useMousePosition({
  elementRef,
  disabled = false
}: UseMousePositionOptions = {}): UseMousePositionResult {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0
  })
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (disabled) {
      setMousePosition({x: 0, y: 0})
      setIsHovering(false)
      return
    }

    const updateMousePosition = (e: MouseEvent) => {
      if (rafId.current) cancelAnimationFrame(rafId.current)

      rafId.current = requestAnimationFrame(() => {
        setMousePosition({x: e.clientX, y: e.clientY})

        if (elementRef && elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect()
          setIsHovering(
            e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
          )
        }
      })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [elementRef, disabled])

  return {...mousePosition, isHovering}
}

export default useMousePosition
