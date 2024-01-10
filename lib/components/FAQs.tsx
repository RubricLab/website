'use client'
import {ChevronDownIcon} from 'lucide-react'
import {useState} from 'react'
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

	return (
		<div
			className={`flex h-12 w-full cursor-pointer flex-col gap-3 rounded-md bg-neutral-100 p-3 transition-[height] duration-100 ease-in hover:h-36 dark:bg-neutral-950 ${
				expand ? 'justify-start' : 'justify-center'
			}`}
			onClick={() => setExpand(prev => !prev)}
			onMouseEnter={() => setExpand(true)}
			onMouseLeave={() => setExpand(false)}>
			<div className='flex w-full items-center justify-between'>
				<p className='font-bold'>{question}</p>
				<ChevronDownIcon
					className={`${
						expand ? '' : '-rotate-90'
					} h-5 w-5 transition-transform duration-300`}
				/>
			</div>
			{expand && <div className='flex flex-col gap-2'>{answer}</div>}
		</div>
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
