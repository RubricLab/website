'use client'
import {Button} from '@/common/ui/button'
import {useLoaded} from '@/hooks/use-loaded'
import {DarkLightImageFragment} from '@/lib/basehub/fragments'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import {useCallback, useEffect, useRef, useState} from 'react'

export type ValuesSliderItem = {
  title: string
  description: string
  image: DarkLightImageFragment
}

export interface LabHeroProps {
  preTitle?: string
  mainTitle: string
  description: string
  explore: {
    title: string
    ctaLabel: string
  }
  values: ValuesSliderItem[]
}

export default function LabHero({
  preTitle,
  mainTitle,
  description,
  explore,
  values
}: LabHeroProps) {
  const loaded = useLoaded()
  const tl = useRef(gsap.timeline({paused: true}))

  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!sectionRef.current) return
      const texts = section.querySelectorAll('[data-hero-text]')

      const description = section.querySelector('[data-hero-description]')
      const exploreText = section.querySelector('#explore-text')
      const exploreCta = section.querySelector('#explore-cta')

      const spllitedTexts = new SplitText(texts, {
        type: 'chars'
      })

      const spllitedDescription = new SplitText(description, {
        type: 'words'
      })

      const spllitedExploreText = new SplitText(exploreText, {
        type: 'words'
      })

      gsap.set([texts, description, exploreText], {
        opacity: 1
      })

      tl.current
        .fromTo(
          spllitedTexts.chars,
          {
            filter: 'blur(12px)',
            opacity: 0
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.05,
            ease: 'power2.inOut'
          }
        )
        .fromTo(
          spllitedDescription.words,
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: 1.5,
            stagger: 0.05,
            ease: 'power3.in'
          },
          0.25
        )
        .fromTo(
          [spllitedExploreText.words, exploreCta],
          {
            opacity: 0,
            filter: 'blur(12px)',
            yPercent: 50
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            yPercent: 0,
            duration: 2,
            stagger: 0.05,
            ease: 'power4.in'
          },
          0.6
        )
    },
    {
      scope: sectionRef
    }
  )

  useEffect(() => {
    if (!loaded) return

    tl.current.play()
  }, [loaded])

  return (
    <section
      ref={sectionRef}
      className='relative flex min-h-fold flex-col px-px'>
      <div className='grid grid-cols-12'>
        <div className='col-span-6 flex flex-col bg-surface p-em-[48] gap-em-[36]'>
          <h1
            data-hero-text
            style={{
              opacity: 0
            }}
            className='uppercase text-em-[72/16]'>
            {preTitle && <span className='opacity-50'>{preTitle}</span>}
            <span className='text-text'>{mainTitle}</span>
          </h1>
          <p
            data-hero-description
            style={{
              opacity: 0
            }}
            className='text-pretty uppercase text-text-secondary text-em-[18/16]'>
            {description}
          </p>
        </div>
        <span className='bg-lines col-span-1 h-full w-full' />
        <ValuesSlider values={values} />
      </div>

      <div className='flex flex-1 flex-col items-center justify-end border-t border-border p-em-[48] gap-em-[40]'>
        <h2
          style={{
            opacity: 0
          }}
          id='explore-text'
          className='max-w-col-6 text-center font-medium uppercase text-em-[32/16]'>
          {explore.title}
        </h2>
        <Button
          style={{
            opacity: 0
          }}
          id='explore-cta'
          size='lg'>
          {explore.ctaLabel}
        </Button>
      </div>
    </section>
  )
}

const SLIDE_DURATION = 5000

const ValuesSlider = ({
  values,
  slideDuration
}: {
  values: ValuesSliderItem[]
  slideDuration?: number
}) => {
  const progressRef = useRef(null)

  const [activeSlide, setActiveSlide] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const animateProgress = useCallback(() => {
    gsap.fromTo(
      progressRef.current,
      {scaleX: 1, opacity: 0},
      {
        scaleX: 0,
        opacity: 1,
        transformOrigin: 'right',
        duration: slideDuration || SLIDE_DURATION / 1000,
        ease: 'none'
      }
    )
  }, [slideDuration])

  useEffect(() => {
    if (isHovering) return

    animateProgress()

    const timeoutId = setTimeout(() => {
      setActiveSlide(prevSlide => (prevSlide + 1) % values.length)
    }, slideDuration || SLIDE_DURATION)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isHovering, activeSlide, slideDuration, values.length, animateProgress])

  useEffect(() => {
    animateProgress()
  }, [activeSlide, animateProgress])

  return (
    <div
      className='relative col-span-5 flex flex-col items-end justify-center bg-surface-contrast/[0.05] px-em-[24]'
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        animateProgress()
      }}>
      <h4 className='font-medium uppercase text-text-secondary text-em-[48/16]'>
        Our values
      </h4>
      <p className='font-medium uppercase text-text-tertiary text-em-[24/16]'>
        {values[activeSlide].title}
      </p>

      <div
        id='values-progress'
        className='absolute bottom-0 left-0 w-full border-t border-border bg-surface-contrast/[0.05] h-em-[12]'>
        <span
          ref={progressRef}
          className='absolute left-0 block h-full w-full bg-surface-contrast/5'
        />
      </div>
    </div>
  )
}
