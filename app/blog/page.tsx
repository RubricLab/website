import {ArrowUpRightIcon} from 'lucide-react'
import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '~/components/Button'
import {DEFAULT_META, META} from '~/constants/metadata'
import {getPosts} from '~/sanity/utils'
import {Post} from '~/types/sanity'
import parseDate from '~/utils/parseDate'

export const metadata: Metadata = {
	...DEFAULT_META,
	openGraph: {
		...DEFAULT_META.openGraph,
		title: `Blog | ${META.title}`
	},
	title: `Blog | ${META.title}`,
	twitter: {
		...DEFAULT_META.twitter,
		title: `Blog | ${META.title}`
	}
}

type PostCardProps = {
	post: Post
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post card
const PostCard = ({post}: PostCardProps) => {
	const date = parseDate(post.publishedAt)
	return (
		<Link
			className='duration-400 group relative flex h-96 flex-col overflow-hidden rounded-md border border-stone-200/90 text-black no-underline transition-colors hover:bg-opacity-80 dark:border-stone-800/90'
			href={`/blog/${post.slug}`}
			key={post._id}>
			<ArrowUpRightIcon className='duration-400 absolute right-0 top-0 h-12 w-12 opacity-0 transition-opacity group-hover:opacity-100' />
			{/* Cover image */}
			<div className='relative h-1/2 w-full'>
				<Image
					alt='Blog cover image'
					className='duration-400 transition-opacity group-hover:opacity-80'
					fill
					src={post.mainImage}
					style={{objectFit: 'cover', objectPosition: 'center'}}
				/>
			</div>
			{/* Post details */}
			<div className='flex h-1/2 flex-col justify-between bg-white p-4 dark:bg-black'>
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
		<div className='my-28 flex min-h-screen w-full flex-col items-center px-5 sm:px-10 2xl:justify-center'>
			<div className='flex h-full max-w-3xl flex-col gap-10'>
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
