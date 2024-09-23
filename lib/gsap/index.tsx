'use client'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import DrawSVGPlugin from 'gsap/dist/DrawSVGPlugin'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import TextPlugin from 'gsap/dist/TextPlugin'

export function GsapSetup() {
	if (typeof window !== 'undefined')
		gsap.registerPlugin(
			TextPlugin,
			DrawSVGPlugin,
			SplitText,
			useGSAP,
			ScrollTrigger
		)

	return null
}

/* gsap effects */
gsap.registerEffect({
  name: 'imageParallax',
  effect: (target: HTMLElement, {
    direction = 'y',
    trigger,
    amount = 0.2,
    noScale = false,
    centered = true,
    markers,
    ease = 'none',
    start = 'top bottom',
    end = 'bottom top'
  }: {
    direction: 'x' | 'y',
    trigger?: HTMLElement,
    amount: number, /* from 0 to Infinity */
    markers?: boolean,
    centered?: boolean,
    noScale?: boolean,
    ease?: gsap.TweenVars['ease']
    start: ScrollTrigger.Vars['start']
    end: ScrollTrigger.Vars['end']
  }) => {
    /* 
      1. Scale the image inside it's container
      2. Move the image inside it's container relative to the scale amount
    */

    const amountPef = amount * 100
    const halfAmountPerc = amountPef / 2
    const scale = noScale ? 1 : 1 + amount

    return gsap.fromTo(
      target,
      {
        scale,
        [direction]: (centered ? halfAmountPerc : amountPef) * -1 + '%',
      },
      {
        [direction]: (centered ? halfAmountPerc : 0) + '%',
        // force3d: true,
        ease,
        overwrite: 'auto',
        scrollTrigger: {
          trigger: trigger ?? target,
          start: start,
          end: end,
          scrub: true,
          markers
        }
      }
    )
  }
})

gsap.registerEffect({
	name: 'parallax',
	effect: (
		targets: gsap.DOMTarget,
		config: {
			speed?: number | ((index: number) => number)
			direction?: 'vertical' | 'horizontal'
			start?: string
			end?: string
      markers?: boolean
      trigger?: gsap.DOMTarget,
      extra?: gsap.TweenVars
		}
	) => {
		const {
			speed = 1,
			direction = 'vertical',
			start = 'top bottom',
			end = 'bottom top',
      markers = false,
      extra,
      trigger
		} = config

		const targetsArr = [targets].flat().map((t, idx) => {
			const speedValue = typeof speed === 'function' ? speed(idx) : speed
			const x = direction === 'horizontal' ? `${speedValue * 100}%` : 0
			const y = direction === 'vertical' ? `${speedValue * 100}%` : 0

			return gsap.to(t, {
				y,
				x,
				ease: 'none',
				scrollTrigger: {
					trigger: trigger || t,
					start: start,
					end: end,
					scrub: true,
          markers
				},
        ...extra
			})
		})

		return targetsArr
	},
	defaults: {
		speed: 1,
		direction: 'vertical',
		start: 'top bottom',
		end: 'bottom top'
	},
	extendTimeline: true
})

export const parallax = gsap.effects.parallax
