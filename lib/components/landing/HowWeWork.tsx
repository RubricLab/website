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
			'After delivering, we can maintain the project on a monthly retainer or hand it off to your team.'
	}
]

function Step({
	rank,
	title,
	description
}: {
	rank: number
	title: string
	description: string
}) {
	return (
		<div className='flex w-full flex-col gap-2 sm:grid sm:grid-cols-8 sm:items-center'>
			<span className='border-primary flex h-14 w-14 items-center justify-center rounded-full border text-center text-2xl'>
				{rank}
			</span>
			<h3 className='text-secondary font-medium'>{title}</h3>
			<p className='sm:col-span-4 sm:col-start-5'>{description}</p>
		</div>
	)
}

export default function HowWeWork() {
	return (
		<SectionLayout id='how-we-work'>
			<div className='flex flex-col items-center text-center'>
				<h1>We like to keep things simple.</h1>
				<h3>Learn about how we work.</h3>
			</div>
			<div className='flex w-full max-w-3xl flex-col gap-12'>
				{steps.map((step, index) => (
					<Step
						key={index}
						title={step.title}
						description={step.description}
						rank={index + 1}
					/>
				))}
			</div>
		</SectionLayout>
	)
}
