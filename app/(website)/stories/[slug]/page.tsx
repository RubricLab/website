import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { getCaseStudy } from '~/sanity/utils'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({ title: 'Customer Stories' })

type PostProps = {
	params: { slug: string }
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Customer story page
export default async function Post({ params }: PostProps) {
	const { slug } = params
	const { imageUrl, title, body } = await getCaseStudy(slug)

	if (!title)
		return (
			<div className="mt-20 flex h-full flex-col gap-10">
				<h1>Coming soon.</h1>
			</div>
		)

	return (
		<div className="mt-20 grid h-full grid-cols-1 items-start gap-10 md:mt-32 md:grid-cols-2">
			<div className="relative h-72 w-full md:h-full">
				<Image
					alt="Customer story image"
					className="rounded-md object-contain md:object-top"
					fill
					src={imageUrl}
				/>
			</div>
			<div className="max-w-xl space-y-10">
				<div>
					<div className="font-bold leading-3">Customer Story</div>
					<h1>{title}</h1>
				</div>
				<div className="flex flex-col gap-4">
					<PortableText value={body} />
				</div>
			</div>
		</div>
	)
}
