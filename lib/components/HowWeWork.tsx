const steps = [
	{title: 'Call', description: ''},
	{title: 'Scope', description: ''},
	{title: 'Start', description: ''},
	{title: 'Deliver', description: ''},
	{title: 'Maintain', description: ''}
]

export default function HowWeWork() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-16 bg-white p-8 dark:bg-black'>
			<h2>How we work</h2>
			{steps.map(step => (
				<div key={step.title}>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</div>
			))}
		</div>
	)
}
