import {PortableText} from '@portabletext/react'
import {Metadata} from 'next'
import Link from 'next/link'
import Button from '~/components/Button'
import {SanityComponents} from '~/components/Sanity'
import {getNewsletterPost} from '~/sanity/utils'
import getMetadata from '~/utils/getMetadata'

type Props = {
	params: {post: string}
}

// Dynamic metadata using route parameters
export async function generateMetadata({params}: Props): Promise<Metadata> {
	// Read route params
	const slug = params.post
	const post = await getNewsletterPost(slug)
	return getMetadata({
		title: `The Grid | ${slug}`,
		description:
			post?.description ||
			'3 actionable insights. Once a week. Straight to your inbox.',
		path: `newsletter/${slug}`,
		previewImageUrl: `newsletter/${slug}/opengraph-image`
	})
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Newsletter post page
export default async function NewsletterPost({params}: Props) {
	const slug = params.post
	const post = await getNewsletterPost(slug)

	return (
		<div className='flex min-h-screen w-full flex-col items-center px-5 sm:my-0 sm:px-10'>
			<div className='my-28 flex max-w-3xl flex-col gap-10'>
				<div>
					<h1>{post.title}</h1>
					<Link
						href='/newsletter'
						className='no-underline'>
						<h3>The Grid</h3>
					</Link>
				</div>
				<div className='flex flex-col gap-4'>
					<PortableText
						value={post.body}
						components={SanityComponents}
					/>
					<div>
						<p>—</p>
						<Link
							className='font-neue-bit text-2xl no-underline'
							href={post.authorTwitter}>
							{post.authorName}
						</Link>
						<p className='opacity-60'>
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</p>
					</div>
				</div>
				<Button
					body='Subscribe to The Grid'
					variant='dark'
					href='/newsletter'
					className='sm:w-fit'
				/>
			</div>
		</div>
	)
}
