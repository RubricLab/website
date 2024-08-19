'use client'

import {useLoaded} from '@/hooks/use-loaded'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {CSSProperties, useEffect, useRef} from 'react'

const backgroundGradient = `repeating-linear-gradient(
								to bottom,
								transparent 0px 0.75em,
								rgb(var(--color-border) / 0.5) 0.75em 1.5em
							)`

export type BackgroundGridProps = {
  highlightColumns?: number[]
}

const BackgroundGrid = ({highlightColumns}: BackgroundGridProps) => {
  const tl = useRef<gsap.core.Timeline>(
    gsap.timeline({
      paused: true
    })
  )

  const loaded = useLoaded()

  useGSAP(() => {
    const columns = gsap.utils.toArray(
      document.querySelectorAll('[data-grid-col]')
    )

    tl.current.to(columns, {
      '--clip-progress': 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    })
  })

  useEffect(() => {
    if (loaded) tl.current.play()
  }, [loaded])

  return (
    <div className='pointer-events-none fixed inset-0 z-0 flex px-sides text-border'>
      <div
        data-grid-col={0}
        className='absolute left-sides h-full w-px'
        style={
          {
            backgroundSize: '1px 1.5em',
            background: backgroundGradient,
            '--clip-progress': 0,
            clipPath:
              'polygon(0% 0%, 100% 0%, 100% calc(var(--clip-progress) * 100%), 0% calc(var(--clip-progress) * 100%))'
          } as CSSProperties
        }
      />
      <div className='grid h-full w-full grid-cols-12 '>
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            data-grid-col={index + 1}
            style={
              {
                '--clip-progress': 0,
                clipPath:
                  'polygon(0% 0%, 100% 0%, 100% calc(var(--clip-progress) * 100%), 0% calc(var(--clip-progress) * 100%))'
              } as CSSProperties
            }
            className={`grid
			${highlightColumns?.includes(index) ? 'bg-surface-contrast/[0.025]' : ''}`}>
            <span
              className='w-px justify-self-end'
              style={{
                backgroundSize: '1px 1.5em',
                background: backgroundGradient
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BackgroundGrid
