import {ArrowUpRightIcon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {getMetadata} from '../../lib/utils'
import {getCaseStudies} from '../../sanity/sanity-utils'
import {CaseStudy} from '../../types/sanity'
import Button from '../components/Button'

export const metadata = getMetadata({title: 'Customer Stories'})

type StoryCardProps = {
	story: CaseStudy
}

const StoryCard = ({
	story: {title, summary, slug, imageUrl}
}: StoryCardProps) => (
	<Link
		className='group relative w-full rounded-xl border bg-white p-10 opacity-90 shadow-2xl transition-opacity hover:!opacity-100'
		href={`/stories/${slug}`}
		target='_blank'>
		<div className='relative mb-5 h-40 rounded-lg'>
			<Image
				alt='Customer story image'
				className='rounded-md object-cover'
				fill
				src={imageUrl}
			/>
		</div>
		<div className='w-full space-y-4 text-black/60 transition-colors group-hover:text-orange-500'>
			<div className='flex items-start justify-between'>
				<h2>{title}</h2>
				<ArrowUpRightIcon className='h-12 w-12 opacity-0 transition-opacity group-hover:opacity-20' />
			</div>
			<p>{summary}</p>
		</div>
	</Link>
)

export const revalidate = 60 // revalidate this page every 60 seconds

const Storys = async () => {
	const stories = await getCaseStudies()

	return (
		<div className='mt-28 flex h-full flex-col gap-10 2xl:justify-center'>
			<h1>Customer Stories</h1>
			<div className='mx-auto flex max-w-xl flex-col items-center gap-5 py-10'>
				{stories.map((story: CaseStudy) => (
					<StoryCard
						key={story._id}
						story={story}
					/>
				))}
				<Button
					body='Ready to tell a new story?'
					className='mt-32'
					href='/contact'
					variant='light'
				/>
			</div>
		</div>
	)
}

export default Storys
