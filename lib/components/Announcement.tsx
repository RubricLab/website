import { ArrowUpRight } from 'lucide-react'
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
		href: 'https://x.com/RubricLabs/status/1719812696575529220',
		date: new Date('11/1/2023')
	},
	{
		title: 'Year in Code w/ Graphite',
		target: '_blank',
		href: 'https://year-in-code.com',
		date: new Date('12/19/2023')
	},
	{
		title: 'Check out our blog w/ Neon',
		target: '_blank',
		href: 'https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true',
		date: new Date('09/18/2023')
	}
]

export default function Announcement() {
	const latest = history[history.length - 1]

	return (
		<Link
			className="group flex w-fit items-center gap-3 rounded-md border border-secondary bg-neutral-100 px-3.5 py-2 text-center text-black no-underline shadow-lg dark:bg-neutral-950 dark:text-white"
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			href={latest?.href as any}
			target={latest?.target}
		>
			<p className="space-x-1 text-sm sm:text-base">
				<span className="font-semibold">New:</span>
				<span>{latest?.title}</span>
			</p>
			<ArrowUpRight className="group-hover:-translate-y-1 transition-all duration-300 group-hover:translate-x-1" />
		</Link>
	)
}
