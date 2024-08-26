'use client'
import {DarkLightImage} from '@/common/dark-light-image'
import ArrowDownIcon from '@/common/icons/arrow-down'
import {Button} from '@/common/ui/button'
import {useLoaded} from '@/hooks/use-loaded'
import {useMeasure} from '@/hooks/use-measure'
import {DarkLightImageFragment} from '@/lib/basehub/fragments'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
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
            ease: 'power2.inOut'
          },
          0.25
        )
        .fromTo(
          [spllitedExploreText.words, exploreCta],
          {
            opacity: 0,
            filter: 'blur(4px)',
            rotate: 2,
            yPercent: 50
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            yPercent: 0,
            rotate: 0,
            duration: 3.5,
            stagger: {
              amount: 1
            },
            ease: 'power3.out'
          },
          0.6
        )
    },
    {
      revertOnUpdate: true,
      dependencies: [topBounds.height],
      scope: containerRef
    }
  )

  const [heroExploreContainerRef, heroExploreContainerBounds] = useMeasure()

  useGSAP(
    () => {
      if (!topBounds.height || !heroExploreContainerBounds.height) return

      gsap.set('#hero-explore', {
        paddingBottom: `calc(48 / var(--toem-base, 16) * 1em + ${topBounds.height}px)`
      })

      const heroExploreContentBounds = document
        .querySelector('#hero-explore-content')
        .getBoundingClientRect()
      const headerHeight =
        document.querySelector('#header')?.getBoundingClientRect().height || 0

      const relativeTop =
        heroExploreContentBounds.top - heroExploreContainerBounds.top
      const distanceToCenter =
        heroExploreContainerBounds.height / 2 - relativeTop
      const centerToCenter =
        distanceToCenter - heroExploreContentBounds.height / 2

      scrollTl.current = gsap
        .timeline({
          scrollTrigger: {
            trigger: '#hero-explore',
            start: `top ${headerHeight + topBounds.height}px`,
            end: 'center center',
            scrub: true,
            markers: true
          }
        })
        .to('#hero-explore-content', {
          y: centerToCenter,
          ease: 'power2.out'
        })
    },
    {
      scope: containerRef,
      revertOnUpdate: true,
      dependencies: [
        heroExploreContainerBounds.top,
        heroExploreContainerBounds.height,
        topBounds.height
      ]
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
      className='relative'>
      <section
        ref={sectionRef}
        className=' flex flex-col px-px'>
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
          className='sticky top-header flex grid-cols-12 flex-col lg:grid'>
          <div className='col-span-6 border-b border-border lg:border-r lg:border-transparent'>
            <div className='flex flex-col bg-surface p-em-[24] gap-em-[24] lg:p-em-[32] lg:gap-em-[36] 2xl:p-em-[48]'>
              <h1
                data-hero-text
                style={{
                  opacity: 0
                }}
                className='font-medium uppercase text-em-[48/16] lg:text-em-[64/16] 2xl:text-em-[72/16]'>
                {preTitle && <span className='opacity-50'>{preTitle}</span>}
                <span className='text-text'>{mainTitle}</span>
              </h1>
              <p
                data-hero-description
                style={{
                  opacity: 0
                }}
                className='text-balance uppercase text-text-secondary text-em-[16/16] md:max-w-col-8 lg:max-w-none 2xl:text-em-[18/16]'>
                {description}
              </p>
            </div>
          </div>
          <span className='bg-lines order-1 col-span-1 w-full border-t border-border h-em-[48] lg:order-none lg:h-full lg:border-none' />
          <ValuesSlider values={values} />
        </div>

        <div
          id='hero-explore'
          className='relative z-10 flex h-fold shrink-0 flex-col items-center justify-end border-y border-border bg-surface p-em-[32] 2xl:p-em-[48]'
          ref={heroExploreContainerRef}>
          {/* <div className='absolute -top-px right-0 w-sides translate-x-full border-t border-border' /> */}
          {/* <div className='absolute -top-px left-0 w-sides -translate-x-full border-t border-border' /> */}
          {/* <div className='absolute -bottom-px right-0 w-sides translate-x-full border-b border-border' /> */}
          {/* <div className='absolute -bottom-px left-0 w-sides -translate-x-full border-b border-border' /> */}

          <div
            id='hero-explore-content'
            className='flex flex-col items-center gap-em-[24] lg:gap-em-[32] 2xl:gap-em-[40]'>
            <h2
              style={{
                opacity: 0
              }}
              id='explore-text'
              className='text-center font-semibold uppercase text-em-[18/16] md:font-medium md:text-em-[24/16] lg:max-w-col-8 lg:text-em-[32/16] 2xl:max-w-col-6'>
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
      className='relative col-span-5 flex aspect-[2] w-full flex-col items-end justify-center overflow-clip bg-surface-contrast/[0.05] px-em-[24] lg:aspect-auto'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='absolute left-0 flex h-full w-1/2 flex-col items-start justify-center pl-em-[12] lg:right-0 lg:items-end lg:pl-0 lg:pr-em-[12]'>
        <h4 className='text-start font-medium uppercase text-text-tertiary text-em-[28/16] md:text-em-[40/16] lg:text-end lg:text-em-[32/16] 2xl:text-em-[48/16]'>
          Our values
        </h4>
        <p className='text-start font-medium uppercase text-text/95 text-em-[18/16] md:text-em-[24/16] lg:text-end lg:text-em-[20/16] 2xl:text-em-[24/16]'>
          {values[activeSlide].title}
        </p>

        <p className='text-pretty text-start font-medium uppercase text-text-secondary mt-em-[12] text-em-[14/16] md:text-em-[20/16] lg:hidden lg:text-end'>
          {values[activeSlide].description}
        </p>
      </div>

      <div className='absolute right-0 aspect-square h-full w-1/2 lg:left-0'>
        <DarkLightImage
          {...values[activeSlide].image}
          className='h-full w-full object-contain'
          priority
        />
      </div>

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
