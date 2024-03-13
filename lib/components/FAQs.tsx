'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from './Accordion'

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
	return (
		<Accordion
			type='single'
			collapsible
			className='w-full'>
			<AccordionItem value={question}>
				<AccordionTrigger className='text-left text-lg'>
					{question}
				</AccordionTrigger>
				<AccordionContent className='text-tertiary text-lg'>
					{answer}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

export default function FAQs() {
	return (
		<div
			id='faq'
			className='flex min-h-screen flex-col items-center justify-center gap-16 p-8 sm:py-28'>
			<h1>Frequently asked questions</h1>
			<div className='flex w-full max-w-3xl flex-col items-center justify-center gap-3'>
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
