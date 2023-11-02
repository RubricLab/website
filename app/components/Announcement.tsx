import {ArrowUpRight} from 'lucide-react'
import Link from 'next/link'

// All announcements ever posted
const history = [
	{
		title: 'Check out our launch with Cal.ai',
		href: 'https://cal.ai',
		target: '_blank',
		date: new Date('10/15/2023')
	},
	{
		title: 'Check out our launch of Create Rubric App',
		target: '_blank',
		href: 'https://twitter.com/RubricLabs/status/1719812696575529220',
		date: new Date('11/1/2023')
	}
]

export default function Announcement() {
	return (
		<Link
			className='group flex items-center gap-3 rounded-full border-2 border-neutral-500 bg-neutral-200 px-3.5 py-2 text-black no-underline shadow-lg dark:bg-neutral-950 dark:text-white'
			href={history[1].href}
			target={history[1].target}>
			<p className='text-sm sm:text-base'>
				<span className='font-semibold'>New:</span> {history[1].title}
			</p>
			<ArrowUpRight className='transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1' />
		</Link>
	)
}
