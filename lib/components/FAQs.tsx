'use client'
import {ChevronDownIcon} from 'lucide-react'
import {useState} from 'react'

const items = [
	{
		question: 'What is your project minimum?',
		answer: (
			<>
				<div>$20k.</div>
				<div>
					However, it depends on the project and team. We make exceptions depending
					on great founder-team fit, so feel free to reach out.
				</div>
			</>
		)
	},
	{
		question: 'Do I work with your engineers directly?',
		answer: (
			<>
				<div>No.</div>
				<div>
					You interact with a member of our team at a weekly or biweekly cadence with
					project updates.
				</div>
			</>
		)
	},
	{
		question: 'Do you help with maintenance after the project?',
		answer: (
			<>
				<div>Yes.</div>
				<div>Maintenance is paid and negotiated in the contract upfront.</div>
			</>
		)
	}
]

function FAQ({question, answer}) {
	const [expand, setExpand] = useState(false)

	return (
		<div
			className={`flex w-full cursor-pointer flex-col justify-start gap-3 rounded-md bg-neutral-100 p-3 transition-[height] duration-200 ease-in dark:bg-neutral-900`}
			onClick={() => setExpand(val => !val)}>
			<div className='flex w-full items-center justify-between'>
				<p className='font-bold'>{question}</p>
				<ChevronDownIcon
					className={`${
						expand ? '' : '-rotate-90'
					} h-5 w-5 transition-transform duration-300`}
				/>
			</div>
			{expand && (
				<div className={`text-tertiary flex flex-col gap-2 transition-opacity`}>
					{answer}
				</div>
			)}
		</div>
	)
}

export default function FAQs() {
	return (
		<div
			id='faq'
			className='flex min-h-screen flex-col items-center justify-center gap-16 p-8 sm:py-28'>
			<h1>Frequently asked questions</h1>
			<div className='flex w-full max-w-3xl grow flex-col gap-3'>
				{items.map(item => (
					<FAQ
						key={item.question}
						answer={item.answer}
						question={item.question}
					/>
				))}
			</div>
		</div>
	)
}
