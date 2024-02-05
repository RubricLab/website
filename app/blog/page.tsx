import {ArrowUpRightIcon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '~/components/Button'
import {getPosts} from '~/sanity/utils'
import {Post} from '~/types/sanity'
import getMetadata from '~/utils/getMetadata'
import parseDate from '~/utils/parseDate'

export const metadata = getMetadata({
	title: 'Blog',
	description:
		'Our writings on the latest in AI-enabled products and experiences. Case studies, analyses, and tutorials.',
	path: 'blog'
})

type PostCardProps = {
	post: Post
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post card
const PostCard = ({post}: PostCardProps) => {
	const date = parseDate(post.publishedAt)
	return (
		<Link
			className='duration-400 group relative flex h-96 flex-col overflow-hidden rounded-md border border-stone-200/90 text-black no-underline opacity-80 transition-all hover:bg-opacity-100 dark:border-stone-800/90'
			href={`/blog/${post.slug}`}
			key={post._id}>
			<ArrowUpRightIcon className='duration-400 absolute right-0 top-0 h-12 w-12 opacity-0 transition-opacity group-hover:opacity-100' />
			{/* Cover image */}
			<div className='relative h-1/2 w-full'>
				<Image
					alt='Blog cover image'
					className='duration-400 opacity-80 transition-opacity group-hover:opacity-100'
					fill
					src={post.mainImage}
					style={{objectFit: 'cover', objectPosition: 'center'}}
				/>
			</div>
			{/* Post details */}
			<div className='flex h-1/2 flex-col justify-between bg-white p-4 px-5 dark:bg-black'>
				<h3 className='font-neue-bit text-4xl'>{post.title}</h3>
				<div className='flex w-full justify-between text-sm'>
					<p className='space-x-1'>
						<span className='text-secondary'>By</span>
						<span>{post.authorName}</span>
					</p>
					<p className='text-secondary'>{date}</p>
				</div>
			</div>
		</Link>
	)
}

export default async function Blog() {
	const posts = await getPosts()
	return (
		<div className='my-32 flex min-h-screen w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full max-w-4xl flex-col gap-16 p-5'>
				<h1>Blog</h1>
				{/* "Coming soon" if there are no posts */}
				{posts.length === 0 && (
					<Button
						body='Coming soon'
						variant='light'
					/>
				)}
				{/* Posts */}
				{posts.length > 0 && (
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
						{posts.map(post => (
							<PostCard
								key={post._id}
								post={post}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
