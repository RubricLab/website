import {PortableText} from '@portabletext/react'
import {Metadata} from 'next'
import Link from 'next/link'
import {DEFAULT_META, META} from '../../../lib/constants'
import {getNewsletterPost} from '../../../sanity/sanity-utils'

export const metadata: Metadata = {
	...DEFAULT_META,
	openGraph: {
		...DEFAULT_META.openGraph,
		title: `The Grid | ${META.title}`
	},
	title: `The Grid | ${META.title}`,
	twitter: {
		...DEFAULT_META.twitter,
		title: `The Grid | ${META.title}`
	}
}

type PostProps = {
	params: {slug: string}
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Newsletter post page
export default async function NewsletterPost({params}: PostProps) {
	const slug = params.slug
	const post = await getNewsletterPost(slug)

	return (
		<div className='flex min-h-screen w-full flex-col items-center justify-center px-5 sm:px-10'>
			<div className='flex max-w-3xl flex-col gap-10 rounded-md bg-black px-10 py-14'>
				<div>
					<Link
						href='/newsletter'
						className='no-underline'>
						<h1>{post.title}</h1>
					</Link>
					<p className='text-sm'>
						Published:{' '}
						{new Date(post.publishedAt).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</p>
				</div>
				<div className='flex flex-col gap-4'>
					<PortableText value={post.body} />
					<div>
						--
						<p>{post.authorName}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
