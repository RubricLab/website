import {PortableText} from '@portabletext/react'
import {Metadata} from 'next'
import Image from 'next/image'
import {DEFAULT_META, META} from '../../../lib/constants'
import {getPost} from '../../../sanity/sanity-utils'

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

export const revalidate = 60 // revalidate this page every 60 seconds

// Blog post page
export default async function Post({params}: PostProps) {
	const slug = params.post
	const post = await getPost(slug)
	return (
		<main className='my-20 flex h-full w-full flex-col items-center p-5 sm:px-10'>
			<div className='flex max-w-3xl flex-col gap-10'>
				{/* Cover image */}
				<div className='relative h-40 w-full'>
					<Image
						alt='Blog cover image'
						className='rounded-md'
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						src={post.mainImage}
						style={{objectFit: 'cover', objectPosition: 'center'}}
					/>
				</div>
				<h2>{post.title}</h2>
				<div className='flex flex-col gap-4'>
					<PortableText value={post.body} />
				</div>
			</div>
		</main>
	)
}
