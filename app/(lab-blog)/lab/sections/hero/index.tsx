'use client'
import ArrowDownIcon from '@/common/icons/arrow-down'
import {Button} from '@/common/ui/button'
import {useLoaded} from '@/hooks/use-loaded'
import {useMeasure} from '@/hooks/use-measure'
import {DarkLightImageFragment} from '@/lib/basehub/fragments'
import spaceBackground from '@/public/images/lab/space-background.png'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import Image from 'next/image'
import {CSSProperties, useEffect, useRef, useState} from 'react'

const SCROLL_DURATION_SCREENS = 3.5

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
  const scrollTl = useRef<GSAPTimeline | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [topRef, topBounds] = useMeasure()
  // intro animation
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
            ease: 'back.out'
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

      const heroExplore = containerRef.current.querySelector('#hero-explore')
      const heroExploreContent = containerRef.current.querySelector(
        '#hero-explore-content'
      )
      const heroTop = containerRef.current.querySelector('#hero-top')

      scrollTl.current = gsap
        .timeline({
          defaults: {
            duration: 1,
            ease: 'none'
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            markers: true
          }
        })
        .to(heroTop, {
          '--clip-progress': 0,
          opacity: 0.5,
          filter: 'blur(12px)',
          ease: 'power3.out'
        })
        .to(
          heroExplore,
          {
            y: -topBounds.height,
            ease: 'power3.out'
          },
          0
        )
        .to(heroExploreContent, {
          yPercent: -50,
          duration: 2
        })
        .to(
          heroExplore,
          {
            yPercent: -20,
            opacity: 0,
            filter: 'blur(24px)'
          },
          '>-1'
        )
    },
    {
      revertOnUpdate: true,
      dependencies: [topBounds.height],
      scope: containerRef
    }
  )

  // wait for the page to load before playing the intro animation
  useEffect(() => {
    if (!loaded) return

    tl.current.play()
  }, [loaded])

  return (
    <div
      ref={containerRef}
      className='relative lg:h-[--scroll-duration]'
      style={
        {
          '--scroll-duration': `calc(${SCROLL_DURATION_SCREENS} * var(--fold-height))`
        } as CSSProperties
      }>
      <section
        ref={sectionRef}
        className='sticky top-header z-10 flex h-fold flex-col px-px'>
        <div
          id='hero-top'
          ref={topRef}
          style={
            {
              '--clip-progress': 1,
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% calc(var(--clip-progress) * 100%), 0% calc(var(--clip-progress) * 100%))'
            } as CSSProperties
          }
          className='grid grid-cols-12'>
          <div className='col-span-6 border-r border-transparent'>
            <div className=' flex flex-col bg-surface p-em-[48] gap-em-[36]'>
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
                className='text-balance uppercase text-text-secondary text-em-[18/16]'>
                {description}
              </p>
            </div>
          </div>
          <span className='bg-lines col-span-1 h-full w-full' />
          <ValuesSlider values={values} />
        </div>

        <div
          style={{
            paddingBottom: `calc(48 / var(--toem-base, 16) * 1em + ${topBounds.height}px)`
          }}
          id='hero-explore'
          className='relative flex h-fold shrink-0 flex-col items-center justify-end border-t border-border bg-surface p-em-[48]'>
          <picture className='absolute bottom-0 left-0 h-full w-full'>
            <Image
              priority
              src={spaceBackground}
              alt='Background'
              className='h-full w-full object-contain object-bottom opacity-50'
            />
          </picture>

          <div
            id='hero-explore-content'
            className='flex flex-col items-center gap-em-[40]'>
            <h2
              style={{
                opacity: 0
              }}
              id='explore-text'
              className='text-center font-medium uppercase text-em-[32/16] lg:max-w-col-8 2xl:max-w-col-6'>
              {explore.title}
            </h2>
            <Button
              style={{
                opacity: 0
              }}
              id='explore-cta'
              size='lg'>
              {explore.ctaLabel}
              <ArrowDownIcon className=' shrink-0 mb-em-[1] ml-em-[8] size-em-[16]' />
            </Button>
          </div>
        </div>
      </section>
    </div>
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
  const progressTl = useRef(
    gsap.timeline({
      paused: true
    })
  )

  const [activeSlide, setActiveSlide] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useGSAP(
    () => {
      if (!progressRef.current) return

      progressTl.current.fromTo(
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
    },
    {
      revertOnUpdate: true
    }
  )

  const handleMouseEnter = () => {
    setIsHovering(true)
    progressTl.current.pause()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    progressTl.current.play()
  }

  useEffect(() => {
    if (isHovering) return

    const timeoutId = setTimeout(() => {
      progressTl.current.restart()

      setActiveSlide(prevSlide => (prevSlide + 1) % values.length)
    }, slideDuration || SLIDE_DURATION)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isHovering, activeSlide, slideDuration, values.length])

  return (
    <div
      className='relative col-span-5 flex flex-col items-end justify-center bg-surface-contrast/[0.05] px-em-[24]'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
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
          style={{
            opacity: 0
          }}
          ref={progressRef}
          className='absolute left-0 block h-full w-full bg-surface-contrast/5'
        />
      </div>
    </div>
  )
}
