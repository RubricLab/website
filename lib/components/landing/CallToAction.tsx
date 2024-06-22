'use client'

import {AnimatePresence, motion, useInView} from 'framer-motion'
import {useRef} from 'react'
import Button from '../Button'
import SectionLayout from './SectionLayout'

const CallToAction = () => {
	const ref = useRef(null)
	const isInView = useInView(ref, {once: true, amount: 0.4})
	return (
		<SectionLayout id='cta'>
			<AnimatePresence mode='wait'>
				<motion.h1
					ref={ref}
					initial='hidden'
					animate={isInView ? 'visible' : 'hidden'}
					variants={{
						hidden: {opacity: 0, y: 50},
						visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: 'easeOut'}}
					}}
					className='text-secondary max-w-2xl text-center italic leading-[3.5rem]'>
					those who are crazy enough to think they can change the world are the ones
					who do
				</motion.h1>
			</AnimatePresence>
			<Button
				body='Get in touch'
				className='w-fit'
				href='/contact'
				variant='dark'
			/>
		</SectionLayout>
	)
}

export default CallToAction
