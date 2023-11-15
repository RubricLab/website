import {PortableText} from '@portabletext/react'
import {Metadata} from 'next'
import Link from 'next/link'
import {DEFAULT_META, META} from '../../../lib/constants'
import {getNewsletterPost} from '../../../sanity/sanity-utils'

type Props = {
	params: {post: string}
}

// Dynamic metadata using route parameters
export async function generateMetadata({params}: Props): Promise<Metadata> {
	// Read route params
	const slug = params.post
	return {
		...DEFAULT_META,
		openGraph: {
			...DEFAULT_META.openGraph,
			title: `The Grid | ${slug} | ${META.title}`,
			description: '3 actionable insights. Once a week. Straight to your inbox.'
		},
		title: `The Grid | ${slug} | ${META.title}`,
		description: '3 actionable insights. Once a week. Straight to your inbox.',
		twitter: {
			...DEFAULT_META.twitter,
			title: `The Grid | ${slug} | ${META.title}`,
			description: '3 actionable insights. Once a week. Straight to your inbox.'
		}
	}
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Newsletter post page
export default async function NewsletterPost({params}: Props) {
	const slug = params.post
	const post = await getNewsletterPost(slug)

	return (
		<div className='my-20 flex min-h-screen w-full flex-col items-center justify-center px-5 sm:my-0 sm:px-10'>
			<div className='flex max-w-3xl flex-col gap-10'>
				<div>
					<Link
						href='/newsletter'
						className='no-underline'>
						<h1>{post.title}</h1>
					</Link>
				</div>
				<div className='flex flex-col gap-4'>
					<PortableText value={post.body} />
					<div>
						--
						<p>{post.authorName}</p>
						<p>
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
