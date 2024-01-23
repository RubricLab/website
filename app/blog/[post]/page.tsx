import {PortableText} from '@portabletext/react'
import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '~/components/Button'
import {SanityComponents} from '~/components/Sanity'
import {getPost} from '~/sanity/utils'
import getMetadata from '~/utils/getMetadata'

type Props = {
	params: {post: string}
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const slug = params.post
	const post = await getPost(slug)
	return getMetadata({
		title: `${post.title} | Blog`,
		description:
			'A post exploring the latest in AI-enabled products and experiences.',
		path: `blog/${slug}`
	})
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post page
export default async function Post({params}: Props) {
	const slug = params.post
	const post = await getPost(slug)

	return (
		<div className='mb-48 mt-28 flex h-full w-full flex-col items-center p-5 sm:px-10'>
			<div className='flex max-w-3xl flex-col gap-10'>
				{/* Cover image */}
				<div className='relative h-96 w-full'>
					<Image
						alt='Blog cover image'
						className='rounded-md'
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						src={post.mainImage}
						style={{objectFit: 'cover', objectPosition: 'center'}}
					/>
				</div>
				{/* Title & author */}
				<div className='flex w-full flex-col gap-2'>
					<h1>{post.title}</h1>
					<div className='text-tertiary flex flex-col gap-1'>
						<span className='space-x-1'>
							<span>By</span>
							<Link
								href={post.authorTwitter}
								className='no-underline'>
								{post.authorName}
							</Link>
						</span>
						<span>
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</span>
					</div>
				</div>
				<hr className='border-stone-300 dark:border-stone-800' />
				<div className='flex flex-col gap-4'>
					<PortableText
						value={post.body}
						components={SanityComponents}
					/>
				</div>
				<div className='mt-16 flex w-full justify-center'>
					<Button
						body='Get in touch'
						variant='dark'
						href='/contact'
						className='w-fit'
					/>
				</div>
			</div>
		</div>
	)
}
