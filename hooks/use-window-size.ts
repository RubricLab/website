import {useEffect, useState} from 'react'

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

    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowSize
