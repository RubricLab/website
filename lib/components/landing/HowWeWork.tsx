import BackgroundGrid from '../BackgroundGrid'
import SectionLayout from './SectionLayout'

export default function HowWeWork() {
	return (
		<SectionLayout
			id='how-we-work'
			className='relative items-end'>
			<BackgroundGrid className='absolute left-0 top-0 h-[100%] w-screen' />
			<div className='flex max-w-3xl flex-col'>
				<h1>We like to keep things simple.</h1>
				<div className='flex flex-col gap-5 '>
					<p className='text-3xl text-neutral-400 dark:text-neutral-500'>
						Our skillset is doing end-to-end, proof of concept work in AI —
						wireframing, architecture, design & development.
					</p>
					<p className='text-3xl text-neutral-400 dark:text-neutral-500'>
						We move quickly, work in sprints, and like to take full ownership over the
						project. We&apos;re{' '}
						<span className='text-secondary'>builders at heart</span> and our core
						value prop is in speed & quality of execution.
					</p>
				</div>
			</div>
		</SectionLayout>
	)
}
