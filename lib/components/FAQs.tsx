'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {ChevronDownIcon} from 'lucide-react'
import {useRef, useState} from 'react'
import Button from './Button'

const items = [
	{
		question: 'What is your project minimum?',
		answer: (
			<>
				<p>$20k.</p>
				<p>
					However, it depends on the project and team. We make exceptions depending
					on great founder-team fit, so feel free to reach out.
				</p>
			</>
		)
	},
	{
		question: 'Do I work with your engineers directly?',
		answer: (
			<>
				<p>No.</p>
				<p>
					You interact with a member of our team at a weekly or biweekly cadence with
					project updates.
				</p>
			</>
		)
	},
	{
		question: 'Do you help with maintenance after the project?',
		answer: (
			<>
				<p>Yes.</p>
				<p>Maintenance is paid and negotiated in the contract upfront.</p>
			</>
		)
	}
]

function FAQ({question, answer}) {
	const [expand, setExpand] = useState(false)
	const ref = useRef(null)

	// Function to calculate height of the content
	const calculateHeight = () => {
		if (ref.current) return ref.current.offsetHeight
		else return 'auto'
	}

	return (
		<motion.div
			className={`flex w-full cursor-pointer flex-col gap-3 rounded-md bg-neutral-100 p-3 transition-[height] duration-500 dark:bg-neutral-950`}
			onClick={() => setExpand(prev => !prev)}>
			<div className='flex w-full items-center justify-between'>
				<p className='font-bold'>{question}</p>
				<ChevronDownIcon
					className={`${
						expand ? '' : '-rotate-90'
					} h-5 w-5 transition-transform duration-300`}
				/>
			</div>

			<AnimatePresence>
				{expand && (
					<motion.div
						initial={{height: 0}}
						animate={{height: calculateHeight()}}
						exit={{height: 0}}
						transition={{duration: 0.3, ease: 'easeIn'}}
						ref={ref}>
						<div className='flex flex-col gap-2'>{answer}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default function FAQs() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-16 bg-white p-8 dark:bg-black'>
			<h1>Frequently asked questions</h1>
			<div className='flex w-full max-w-3xl flex-col gap-3'>
				{items.map(item => (
					<FAQ
						key={item.question}
						answer={item.answer}
						question={item.question}
					/>
				))}
			</div>
			<Button
				body='Get in touch'
				className='w-fit'
				href='/contact'
				variant='dark'
			/>
		</div>
	)
}
