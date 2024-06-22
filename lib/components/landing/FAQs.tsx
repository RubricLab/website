'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '../Accordion'
import SectionLayout from './SectionLayout'

const steps = [
	{
		title: 'Prospecting',
		description:
			'We call once for 30 min to discuss your project, goals, and roadmap.'
	},
	{
		title: 'Scoping',
		description:
			'Provided there is mutual fit, our team writes a memo, outlining the effort, timeline, and budget.'
	},
	{
		title: 'Onboarding',
		description:
			'After agreeing on project terms, we add you to a shared Slack channel and get going.'
	},
	{
		title: 'Building',
		description:
			'We execute on the project terms and update you weekly or bi-weekly.'
	},
	{
		title: 'Offboarding',
		description:
			'After delivering, we can maintain the project on a monthly retainer or hand it off to your team. We prefer to hand it off to your team.'
	}
]

const questions = [
	{
		question: 'What is your project minimum?',
		answer: (
			<p className='text-tertiary '>
				We don&apos;t work on projects shorter than 3 weeks.
			</p>
		)
	},
	{
		question: 'Do I work with your engineers directly?',
		answer: (
			<p className='text-tertiary'>
				No. You interact with a member of our team at a recurring cadence.
			</p>
		)
	},
	{
		question: 'Do you help with maintenance after the project?',
		answer: (
			<p className='text-tertiary'>
				Yes. Maintenance is paid and negotiated in the contract upfront.
			</p>
		)
	},
	{
		question: 'How do you work with clients?',
		answer: (
			<div className='text-tertiary flex flex-col gap-3 '>
				<ol>
					{steps.map((step, index) => (
						<li
							key={step.title}
							className='text-tertiary'>
							<span className='font-bold'>{step.title}</span> — {step.description}
						</li>
					))}
				</ol>
			</div>
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
				<AccordionContent className='text-lg'>{answer}</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

export default function FAQs() {
	return (
		<SectionLayout
			id='faq'
			className='from-white to-white dark:from-black dark:to-black'>
			<h1>Frequently asked questions</h1>
			<div className='flex w-full max-w-3xl flex-col items-center justify-center gap-3'>
				{questions.map(question => (
					<FAQ
						key={question.question}
						answer={question.answer}
						question={question.question}
					/>
				))}
			</div>
		</SectionLayout>
	)
}
