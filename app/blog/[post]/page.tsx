import {PortableText} from '@portabletext/react'
import urlBuilder from '@sanity/image-url'
import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '~/components/Button'
import {DEFAULT_META} from '~/constants/metadata'
import {getPost, sanity} from '~/sanity/utils'

type Props = {
	params: {post: string}
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const slug = params.post
	const post = await getPost(slug)
	return {
		...DEFAULT_META,
		openGraph: {
			...DEFAULT_META.openGraph,
			title: `${post.title} | Blog`
		},
		title: `${post.title} | Blog`,
		twitter: {
			...DEFAULT_META.twitter,
			title: `${post.title} | Blog`
		}
	}
}

const portableComponents = {
	types: {
		image: ({value}) => (
			<div className='opacity-90 transition-opacity hover:opacity-100'>
				<Image
					src={urlBuilder(sanity).image(value).url()}
					alt={value.alt || ' '}
					loading='lazy'
					width={0}
					height={0}
					sizes='100vw'
					className='my-4 h-auto w-full rounded-md'
				/>
				{value.alt ? (
					<p className='text-center text-sm text-stone-500'>{value.alt}</p>
				) : null}
			</div>
		)
	}
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post page
export default async function Post({params}: Props) {
	const slug = params.post
	const post = await getPost(slug)

	return (
		<div className='mb-48 mt-20 flex h-full w-full flex-col items-center p-5 sm:px-10'>
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
					<div className='text-secondary flex gap-1'>
						<Link
							href={post.authorTwitter}
							className='no-underline'>
							<span>{post.authorName}</span>
						</Link>
						<span>~</span>
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
						components={portableComponents}
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
