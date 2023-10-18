import {ArrowUpRight} from 'lucide-react'
import Link from 'next/link'

export default function Announcement() {
	return (
		<Link
			className='group flex items-center gap-3 rounded-full border-2 border-neutral-500 bg-neutral-200 px-3.5 py-2 text-black shadow-lg dark:bg-neutral-950 dark:text-white'
			href='https://cal.ai'>
			<p className='text-sm sm:text-base'>
				<span className='font-semibold'>New:</span> Check out our launch with Cal.ai
			</p>
			<ArrowUpRight className='transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1' />
		</Link>
	)
}
