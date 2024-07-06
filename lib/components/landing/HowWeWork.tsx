'use client'

import {AnimatePresence, motion, useInView} from 'framer-motion'
import {useRef} from 'react'
import BackgroundGrid from '../BackgroundGrid'
import SectionLayout from './SectionLayout'

export const GradientBackgroundGrid = () => {
	return (
		<div className='parent absolute left-0 top-0 h-[100%] w-screen'>
			<span className='absolute left-0 top-0 z-50 flex h-[20%] w-screen bg-gradient-to-b from-white to-white/0 dark:from-black dark:to-black/0' />
			<BackgroundGrid className='absolute left-0 top-0 z-0 h-[100%] w-screen dark:opacity-10' />
			<span className='absolute bottom-0 left-0 z-50 flex h-[20%] w-screen bg-gradient-to-t from-neutral-100 to-white/0 dark:from-neutral-900 dark:to-black/0' />
		</div>
	)
}

export default function HowWeWork() {
	const ref = useRef(null)
	const isInView = useInView(ref, {once: true, amount: 0.4})
	return (
		<SectionLayout
			id='how-we-work'
			className='relative items-start'>
			<GradientBackgroundGrid />
			<AnimatePresence mode='wait'>
				<motion.div
					ref={ref}
					initial='hidden'
					animate={isInView ? 'visible' : 'hidden'}
					variants={{
						hidden: {opacity: 0, y: 50},
						visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: 'easeOut'}}
					}}
					className='flex max-w-3xl flex-col'>
					<div className='flex flex-col gap-5'>
						<p className='text-3xl leading-normal text-neutral-400 dark:text-neutral-500'>
							We specialize in building proof of concept software in Artificial
							Intelligence —{' '}
							<span className='text-secondary'>
								wireframing, architecting, designing & development
							</span>
							. We cover the entire stack.
						</p>
						<p className='text-3xl leading-normal text-neutral-400 dark:text-neutral-500'>
							We move quickly, work in sprints & like to take full ownership over the
							project. We&apos;re builders at heart & our core value prop is in{' '}
							<span className='text-secondary'>speed & quality of execution.</span>
						</p>
					</div>
				</motion.div>
			</AnimatePresence>
		</SectionLayout>
	)
}
