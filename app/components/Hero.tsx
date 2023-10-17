'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import Announcement from './Announcement'
import Game from './game'

export default function Hero() {
	const router = useRouter()

	const [start, setStart] = useState(false)

	useEffect(() => {
		setTimeout(() => setStart(true), 1 * 1000)
	}, [])

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-8'>
			<div className={''}>
				<Game
					running={start}
					setRunning={setStart}
				/>
			</div>
			<AnimatePresence>
				{start && (
					<motion.div
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
						transition={{duration: 3, delay: 1}}
						className='flex w-full flex-col items-center gap-16'>
						<Announcement />
						<div className='flex flex-col items-center gap-16 text-black dark:text-white'>
							<p className='max-w-2xl text-center text-4xl sm:text-5xl'>
								We&apos;re a digital studio making{' '}
								<span className='font-neue-bit text-7xl'>ai-first</span> software.
							</p>
							<p className='invisible sm:visible'>
								Press{' '}
								<span
									onClick={() => router.push('/contact')}
									className='mx-1 cursor-pointer rounded-md bg-black px-3 py-2 text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black'>
									R
								</span>{' '}
								anytime to get started
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
