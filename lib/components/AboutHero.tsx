'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
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
						animate={{opacity: 1}}
						className='flex w-full flex-col items-center gap-16'
						exit={{opacity: 0}}
						initial={{opacity: 0}}
						transition={{delay: 1, duration: 3}}>
						<p className='max-w-2xl text-center text-4xl text-black sm:text-4xl dark:text-white'>
							We&apos;re Rubric. A nomadic team of engineers and artists.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
