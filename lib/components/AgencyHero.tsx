'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/navigation'

export default function Hero() {
	const router = useRouter()

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-8'>
			<AnimatePresence>
				<motion.div
					animate={{opacity: 1}}
					className='flex w-full flex-col items-center gap-16'
					exit={{opacity: 0}}
					initial={{opacity: 0}}
					transition={{duration: 2}}>
					<div className='flex flex-col gap-16 text-black dark:text-white'>
						<p className='text-[100px]'>
							We&apos;re a digital agency making <b>AI-first</b> software.
						</p>
						<p className='text-secondary invisible sm:visible'>
							Press{' '}
							<span
								className='mx-1 cursor-pointer rounded-md bg-black px-2.5 py-1.5 font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black'
								onClick={() => router.push('/contact')}>
								R
							</span>{' '}
							anytime to get started
						</p>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
