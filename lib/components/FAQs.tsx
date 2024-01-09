'use client'
import {ChevronDownIcon} from 'lucide-react'
import {useState} from 'react'
import Button from './Button'

const items = [
	{question: 'What is your project minimum?', answer: '$20k.'},
	{question: 'Why Rubric?', answer: 'We the best.'},
	{question: 'Do I work with your engineers directly?', answer: 'Nope.'},
	{question: 'What is your process?', answer: 'Refer here.'},
	{question: 'Do you help with maintenance after the project?', answer: 'Yes.'}
]

function FAQ({question, answer}: {question: string; answer: string}) {
	const [expand, setExpand] = useState(false)
	return (
		<div
			className='flex w-full cursor-pointer flex-col gap-3 rounded-md bg-neutral-100 p-3 dark:bg-neutral-950'
			onClick={() => setExpand(prev => !prev)}>
			<div className='flex w-full items-center justify-between'>
				<p className='font-bold'>{question}</p>
				<ChevronDownIcon
					className={`${
						expand ? '' : '-rotate-90'
					} h-5 w-5 transition-transform duration-300`}
				/>
			</div>
			{expand && <p>{answer}</p>}
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
