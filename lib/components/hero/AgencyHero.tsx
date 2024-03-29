'use client'
import Spline from '@splinetool/react-spline'
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link'
import Announcement from '../Announcement'

// TODO: update to production URL, however, at the time of writing (Feb 23 2024), prod URL was not updating to draft
const spline = 'https://draft.spline.design/U8pZk4qwOdsnkA6D/scene.splinecode'

export default function AgencyHero() {
	return (
		<div className='flex h-full min-h-screen w-screen flex-col items-center justify-center gap-5 p-5 pt-20 sm:flex-row sm:px-10'>
			<div className='flex w-full max-w-7xl flex-col items-center justify-center gap-5 sm:flex-row'>
				<AnimatePresence>
					<motion.div
						animate={{opacity: 1}}
						className='z-10 flex w-full flex-col items-center gap-16'
						exit={{opacity: 0}}
						initial={{opacity: 0}}
						transition={{duration: 2}}>
						<div className='flex h-full flex-col gap-8 text-black sm:gap-16 dark:text-white'>
							<div className='flex flex-col gap-8 sm:gap-0'>
								<Announcement />
								<p className='text-4xl tracking-tight sm:text-8xl sm:leading-[7.5rem]'>
									We make magical,{' '}
									<span className='whitespace-nowrap font-bold'>AI-first</span> software.
								</p>
							</div>

							<p className='text-secondary max-w-xl text-2xl sm:leading-10'>
								We work with startups big & small to build the future users want.
							</p>

							<p className='text-secondary invisible sm:visible'>
								Press{' '}
								<Link
									href='/contact'
									className='no-underline'>
									<span className='pointer-events-auto mx-0.5 cursor-pointer rounded-md bg-black px-2 py-1 font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black'>
										R
									</span>
								</Link>{' '}
								anytime to get started.
							</p>
						</div>
					</motion.div>
				</AnimatePresence>
				<div className='h-[40vh] w-full sm:h-[70vh] sm:max-w-md'>
					<Spline scene={spline} />
				</div>
			</div>
		</div>
	)
}
