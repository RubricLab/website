'use client'
import {DarkLightImage} from '@/common/dark-light-image'
import ArrowDownIcon from '@/common/icons/arrow-down'
import {Button} from '@/common/ui/button'
import {useBreakpoint} from '@/hooks/use-breakpoint'
import {useLoaded} from '@/hooks/use-loaded'
import {useMeasure} from '@/hooks/use-measure'
import useMousePosition from '@/hooks/use-mouse-position'
import {DarkLightImageFragment} from '@/lib/basehub/fragments'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'

import astronaut from '@/public/images/lab/ASTRONAUT_STROKE.png'
import mac from '@/public/images/lab/MAC_STROKE.png'
import satellite from '@/public/images/lab/SATELLITE_STROKE.png'
import Image from 'next/image'

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
        .to(
          ['#astronaut', '#satellite', '#mac', '#moon'],
          {
            opacity: 1,
            duration: 3,
            ease: 'power1.out'
          },
          '<'
        )
        .fromTo(
          '#hero-values',
          {
            filter: 'blur(4px)',
            opacity: 0
          },
          {
            opacity: 1,
            filter: 'blur(0px)'
          },
          1.5
        )
    },
    {
      revertOnUpdate: true,
      dependencies: [topBounds.height],
      scope: containerRef
    }
  )

  const [heroExploreContainerRef, heroExploreContainerBounds] = useMeasure()
  const lg = useBreakpoint('lg')

  useGSAP(
    () => {
      if (!topBounds.height || !heroExploreContainerBounds.height || !lg) return

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

      const scrollTriggerStart = `top ${headerHeight + topBounds.height}px`

      gsap.to('#hero-explore-content', {
        y: centerToCenter,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#hero-explore',
          start: scrollTriggerStart,
          end: 'center center',
          scrub: 0.25
        }
      })

      gsap.effects.parallax('#astronaut', {
        trigger: '#hero-explore',
        start: scrollTriggerStart,
        speed: 1,
        extra: {
          rotate: '15deg',
          x: '-10%',
          scale: 1.5
        }
      })

      gsap.effects.parallax('#mac', {
        trigger: '#hero-explore',
        start: scrollTriggerStart,
        speed: -1.5,
        extra: {
          rotate: '-45deg',
          scale: 0.75
        }
      })

      gsap.effects.parallax('#satellite', {
        trigger: '#hero-explore',
        start: scrollTriggerStart,
        speed: -0.2,
        extra: {
          rotate: '15deg'
        }
      })
    },
    {
      scope: containerRef,
      revertOnUpdate: true,
      dependencies: [
        lg,
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
      className='relative z-30'>
      <section
        ref={sectionRef}
        className='flex flex-col px-px'>
        <div
          id='hero-top'
          ref={topRef}
          className='top-header grid grid-cols-1 grid-rows-[repeat(2,_minmax(0,1fr))_max-content] lg:sticky lg:h-auto lg:grid-cols-12 lg:grid-rows-none'
          >
          <div className='lg:boder-b-0 border-b border-border bg-surface lg:col-span-6 lg:border-r-[2px] lg:border-transparent lg:bg-transparent'>
            <div className='flex flex-col justify-center bg-surface px-em-[24] py-em-[48] gap-em-[24] lg:p-em-[32] lg:gap-em-[36] 2xl:p-em-[48]'>
              <h1
                data-hero-text
                style={{
                  opacity: 0
                }}
                className='font-medium text-em-[48/16] lg:text-em-[64/16] 2xl:text-em-[72/16]'>
                {preTitle && <span className='opacity-50'>{preTitle}</span>}
                <span className='text-text'>{mainTitle}</span>
              </h1>
              <p
                data-hero-description
                style={{
                  opacity: 0
                }}
                className='text-balance text-text-secondary text-em-[16/16] md:max-w-col-8 lg:max-w-none 2xl:text-em-[18/16]'>
                {description}
              </p>
            </div>
          </div>
          <span className='bg-lines w-full border-t border-border h-em-[48] lg:h-auto lg:border-none' />
          <ValuesSlider values={values} />
          <span className='bg-lines w-full border-t border-border h-em-[72] lg:hidden' />
        </div>

        <div
          id='hero-explore'
          className='relative z-10 flex h-fold shrink-0 flex-col items-center justify-center overflow-hidden border-y border-border bg-surface p-em-[48] lg:justify-end'
          ref={heroExploreContainerRef}>
          <picture className='absolute left-0 top-0 w-full translate-x-[-40%] opacity-50 invert dark:invert-0 max-lg:translate-y-[-20%] lg:bottom-0 lg:w-1/2'>
            <Image
              id='satellite'
              priority
              src={satellite}
              alt='satellite'
              quality={100}
              style={{
                transformOrigin: '60% 40%'
              }}
              className='h-full w-full object-contain object-bottom opacity-0'
            />
          </picture>

          {/* <picture className='absolute top-[5%] opacity-50 max-lg:right-0 max-lg:w-1/2 max-lg:translate-x-1/2 max-lg:rotate-180 lg:left-[0%] lg:w-1/4 lg:translate-y-[-20%]'>
						<Image
							id='moon'
							priority
							src={moon}
							alt='moon'
							quality={100}
							className='h-full w-full object-contain object-bottom opacity-0'
						/>
					</picture> */}

          <picture className='absolute right-[30%] top-[60%] hidden w-1/4 translate-x-[25%] opacity-50 invert dark:invert-0 lg:block'>
            <Image
              id='mac'
              priority
              src={mac}
              quality={100}
              alt='mac'
              className='h-full w-full object-contain object-bottom opacity-0'
            />
          </picture>

          <picture className='absolute bottom-0 right-0 w-full translate-x-[35%] opacity-50 invert dark:invert-0 max-lg:translate-y-[40%] lg:w-1/2 lg:translate-x-[25%]'>
            <Image
              id='astronaut'
              priority
              src={astronaut}
              quality={100}
              alt='astronaut'
              className='h-full w-full object-contain object-bottom opacity-0'
            />
          </picture>

          <div
            id='hero-explore-content'
            className='flex flex-col items-center gap-em-[24] lg:gap-em-[32] 2xl:gap-em-[40]'>
            <h2
              style={{
                opacity: 0
              }}
              id='explore-text'
              className='text-center font-semibold text-em-[18/16] md:font-medium md:text-em-[24/16] lg:max-w-col-8 lg:text-em-[32/16] 2xl:max-w-col-6'>
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

const SLIDE_DURATION = 5000 // 5 seconds

const ValuesSlider = ({
  values,
  slideDuration = SLIDE_DURATION
}: {
  values: ValuesSliderItem[]
  slideDuration?: number
}) => {
  const progressRef = useRef(null)
  const progressTl = useRef(gsap.timeline({paused: true}))
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  const [activeSlide, setActiveSlide] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const isDesktop = useBreakpoint('lg')

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
          duration: slideDuration / 1000,
          ease: 'none'
        }
      )
    },
    {revertOnUpdate: true}
  )

  const animateContent = (direction: 'in' | 'out') => {
    const tl = gsap.timeline()

    const elements = [
      imageRef.current,
      titleRef.current,
      descriptionRef.current
    ]

    if (direction === 'out')
      tl.to(elements, {
        opacity: 0,
        yPercent: -5,
        filter: 'blur(4px)',
        transformOrigin: 'bottom left',
        duration: 0.3,
        stagger: 0.1
      })
    else
      tl.fromTo(
        elements,
        {
          opacity: 0,
          yPercent: 5,
          filter: 'blur(6px)',
          transformOrigin: 'bottom left'
        },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.3,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )

    return tl
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (isDesktop) progressTl.current.pause()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (isDesktop) progressTl.current.play()
  }

  useEffect(() => {
    if (isHovering) return

    const timeoutId = setTimeout(() => {
      const outTl = animateContent('out')

      outTl.eventCallback('onComplete', () => {
        setActiveSlide(prevSlide => (prevSlide + 1) % values.length)
        progressTl.current.restart()
        animateContent('in')
      })
    }, slideDuration)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isHovering, activeSlide, slideDuration, values.length])

  return (
    <>
      <div
        style={{
          opacity: 0
        }}
        id='hero-values'
        className='relative col-span-5 flex w-full flex-col overflow-hidden bg-surface-contrast/[0.05] lg:aspect-auto lg:px-em-[24]'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <div className='relative h-full w-full'>
          <div
            ref={imageRef}
            className='absolute right-0 aspect-square h-full w-1/2 lg:left-0'>
            <DarkLightImage
              {...values[activeSlide].image}
              className='h-full w-full object-contain'
              priority
            />
          </div>
          <div className='absolute left-0 flex h-full w-1/2 flex-col items-start justify-center pl-em-[12] lg:left-auto lg:right-0 lg:items-end lg:pl-0 lg:pr-em-[12]'>
            <h4 className='text-start font-medium text-text-tertiary text-em-[28/16] md:text-em-[40/16] lg:text-end lg:text-em-[32/16] 2xl:text-em-[48/16]'>
              Our values
            </h4>
            <h5
              ref={titleRef}
              id='value-title'
              className='line-clamp-2 h-[4em] overflow-hidden text-start font-medium text-text/95 text-em-[24/16] lg:h-[3em] lg:text-end lg:text-em-[20/16] 2xl:text-em-[24/16]'>
              {values[activeSlide].title}
            </h5>
          </div>
        </div>

        <div
          ref={descriptionRef}
          className='border-border bg-surface-secondary px-em-[12] py-em-[24] mb-em-[12] h-em-[140] lg:hidden'>
          <p className='text-pretty text-start font-medium text-text-secondary'>
            {values[activeSlide].description}
          </p>
        </div>
        <div
          id='values-progress'
          className='absolute bottom-0 left-0 w-full border-t border-border bg-surface-contrast/[0.05] h-em-[12]'>
          <span
            ref={progressRef}
            className='absolute left-0 block h-full w-full bg-surface-contrast/10'
            style={{opacity: 0}}
          />
        </div>
      </div>

      <ValuesTooltip
        content={values[activeSlide].description}
        isDesktop={isDesktop}
        isHovering={isHovering}
      />
    </>
  )
}

interface ValuesTooltipProps {
  content: string
  isDesktop: boolean
  isHovering: boolean
}

const ValuesTooltip: React.FC<ValuesTooltipProps> = ({
  content,
  isDesktop,
  isHovering
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const {x, y} = useMousePosition({
    disabled: !isDesktop
  })

  useEffect(() => {
    if (!isDesktop || !tooltipRef.current || !isHovering) return

    if (tweenRef.current) tweenRef.current.kill()
    const tooltipHeight = tooltipRef.current.getBoundingClientRect().height

    tweenRef.current = gsap.to(tooltipRef.current, {
      x: x - tooltipRef.current.offsetWidth / 2,
      y: y - tooltipHeight,
      opacity: isHovering ? 1 : 0,
      duration: 0.5,
      ease: 'power3.out'
    })
  }, [isDesktop, isHovering, x, y, content])

  useLayoutEffect(() => {
    const tooltipHeight = tooltipRef.current.getBoundingClientRect().height

    if (isHovering) {
      gsap.set(tooltipRef.current, {
        x: x - tooltipRef.current.offsetWidth / 2,
        y: y - tooltipHeight
      })
      gsap.to(tooltipRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      })
    } else
      gsap.to(tooltipRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      })
  }, [isHovering, content])

  return (
    <div
      ref={tooltipRef}
      style={{
        opacity: 0
      }}
      className='pointer-events-none fixed left-0 top-0 z-50 max-w-col-3 border-border bg-surface-secondary p-em-[12] 2xl:max-w-col-2'>
      <p className='text-pretty text-start font-medium text-text-secondary text-em-[16/16] 2xl:text-em-[18/16]'>
        {content}
      </p>
    </div>
  )
}
