import {PortableText} from '@portabletext/react'
import urlBuilder from '@sanity/image-url'
import {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '~/components/Button'
import {DEFAULT_META, META} from '~/constants/metadata'
import {getPost, sanity} from '~/sanity/utils'

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

type PostProps = {
	params: {post: string}
}

const portableComponents = {
	types: {
		image: ({value}) => {
			return (
				<div className='relative h-96 w-full'>
					<Image
						src={urlBuilder(sanity).image(value).fit('max').auto('format').url()}
						alt={value.alt || ' '}
						loading='lazy'
						fill
						style={{objectFit: 'cover', objectPosition: 'center'}}
						className='rounded-md'
					/>
					<span className='opacity-80'>{value.alt}</span>
				</div>
			)
		}
	}
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post page
export default async function Post({params}: PostProps) {
	const slug = params.post
	const post = await getPost(slug)
	return (
		<div className='my-20 flex h-full w-full flex-col items-center p-5 sm:px-10'>
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
				<div className='flex w-full flex-col gap-3'>
					<h2>{post.title}</h2>
					<div className='flex gap-1'>
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
				<hr className='border-stone-700' />
				<div className='flex flex-col gap-4'>
					<PortableText
						value={post.body}
						components={portableComponents}
					/>
				</div>
				<div className='flex w-full justify-center'>
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
