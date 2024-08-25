'use client'

import {useLoaded} from '@/hooks/use-loaded'
import {Breakpoint, getCurrBreakpoint} from '@/lib/utils/breakpoints'
import cn from '@/lib/utils/cn'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import entries from 'lodash/entries'
import {CSSProperties, useEffect, useRef} from 'react'

export const backgroundGradient = `repeating-linear-gradient(
								to bottom,
								transparent 0px 0.75em,
								rgb(var(--color-border) / 0.5) 0.75em 1.5em
							)`

type GridBreakpointData = {
	columnCount: Number
	highlightColumns?: number[]
}

export type BackgroundGridProps = {
	data: {
		[key in Breakpoint]: GridBreakpointData
	}
}

const BackgroundGrid = ({data}: BackgroundGridProps) => {
	const tl = useRef<gsap.core.Timeline>(
		gsap.timeline({
			paused: true,
			defaults: {
				ease: 'power1.out',
				duration: 0.6
			}
		})
	)

	const loaded = useLoaded()

	useGSAP(
		() => {
			const bp = getCurrBreakpoint()

			/* animate active breakpoint */
			tl.current
				.to(['[data-grid-nobreakpoint="true"]', `[data-grid-breakpoint="${bp}"] [data-grid-col]`], {
					'--clip-progress': 1,
					stagger: {
						ease: 'power1.in',
						each: 0.1
					}
				})
				.to(`[data-grid-breakpoint="${bp}"] [data-highlighted="true"]`, {
					'--background-opacity': 0.025,
					stagger: {
						ease: 'power1.in',
						each: 0.05
					}
				})

			/* set the rest as completed without animation */
			Object.keys(data).forEach(breakpoint => {
				if (breakpoint !== bp) {
					gsap.set(`[data-grid-breakpoint="${breakpoint}"] [data-grid-col]`, {
						'--clip-progress': 1
					})
					gsap.set(
						`[data-grid-breakpoint="${breakpoint}"] [data-highlighted="true"]`,
						{
							'--background-opacity': 0.025
						}
					)
				}
			})
		},
		{
			revertOnUpdate: true
		}
	)

	useEffect(() => {
		if (loaded) tl.current.play()
	}, [loaded])

	return (
		<div className='pointer-events-none fixed inset-0 z-0 flex px-sides text-border'>
			<div
				data-grid-nobreakpoint="true"
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
			{entries(data).map(([breakpoint, config]) => {
				return (
					<div
						key={breakpoint}
						data-grid-breakpoint={breakpoint}
						className={cn(`h-full w-full`, {
							'grid md:hidden': breakpoint === 'sm',
							'hidden md:max-lg:grid': breakpoint === 'md',
							'hidden lg:max-xl:grid': breakpoint === 'lg',
							'hidden xl:max-2xl:grid': breakpoint === 'xl',
							'hidden 2xl:grid': breakpoint === '2xl'
						})}
						style={{
							gridTemplateColumns: `repeat(${config.columnCount}, 1fr)`
						}}>
						{[...Array(config.columnCount)].map((_, index) => {
							const dataAttrs = {
								['data-grid-col']: index + 1,
								['data-highlighted']: config.highlightColumns?.includes(index)
							}

							return (
								<div
									key={index}
									className='grid transition-colors ease-out'
									{...dataAttrs}
									style={
										{
											'--background-opacity': 0.0,
											'--clip-progress': 0,
											background:
												'rgb(var(--color-surface-contrast) / var(--background-opacity))',
											clipPath:
												'polygon(0% 0%, 100% 0%, 100% calc(var(--clip-progress) * 100%), 0% calc(var(--clip-progress) * 100%))'
										} as CSSProperties
									}>
									<span
										className='w-px justify-self-end'
										style={{
											backgroundSize: '1px 1.5em',
											background: backgroundGradient
										}}
									/>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}

export default BackgroundGrid
