'use client'
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-5 pt-20 sm:px-10'>
			<AnimatePresence>
				<motion.div
					animate={{opacity: 1}}
					className='flex w-full flex-col items-center gap-16'
					exit={{opacity: 0}}
					initial={{opacity: 0}}
					transition={{duration: 2}}>
					<div className='flex h-full flex-col gap-8 text-black dark:text-white sm:gap-16'>
						<p className='text-6xl tracking-tight sm:text-8xl sm:leading-[7.5rem]'>
							We make <span className='whitespace-nowrap font-bold'>AI-enabled</span>,{' '}
							<span className='font-bold'>magical</span> software.
						</p>
						<p className='text-secondary max-w-xl text-2xl sm:leading-10'>
							Rubric is a digital studio working with startups big & small to build the
							future users want.
						</p>
						<p className='text-secondary invisible sm:visible'>
							Press{' '}
							<Link
								href='/contact'
								className='no-underline'>
								<span className='mx-0.5 cursor-pointer rounded-md bg-black px-2 py-1 font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black'>
									R
								</span>
							</Link>{' '}
							anytime to get started.
						</p>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
