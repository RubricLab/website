const steps = [
	{
		title: 'Call',
		description:
			'We discuss your vision for the project, outline the success criteria and what an ideal outcome looks like.'
	},
	{
		title: 'Scope',
		description:
			'We write a memo, outlining the rough scope, effort, and timeline.'
	},
	{
		title: 'Iterate',
		description: 'We iterate on this together untile we have mutual clarity.'
	},
	{
		title: 'Start',
		description:
			'We add you to a shared Slack channel, share a project management board, and are off to the races.'
	},
	{title: 'Deliver', description: 'We deliver the project.'},
	{title: 'Maintain', description: 'We maintain the project.'}
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
		<div className='grid w-full grid-cols-8 gap-3'>
			<span className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-center text-2xl'>
				{rank}
			</span>
			<h3 className=''>{title}</h3>
			<p className='col-span-4 col-start-4'>{description}</p>
		</div>
	)
}

export default function HowWeWork() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-16 bg-white p-8 dark:bg-black'>
			<div className='flex flex-col items-center'>
				<h1>We like to keep things simple.</h1>
				<h3>Learn about how we work.</h3>
			</div>
			<div className='flex w-full max-w-3xl flex-col gap-5'>
				{steps.map((step, index) => (
					<Step
						key={index}
						title={step.title}
						description={step.description}
						rank={index + 1}
					/>
				))}
			</div>
		</div>
	)
}
