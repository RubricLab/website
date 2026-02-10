import Link from 'next/link'
import { cn } from '~/lib/utils/cn'
import { formatDate } from '~/lib/utils/date'
import { CustomImage } from '~/ui/custom-image'

export const Card = ({
	post,
	imgSrc,
	imgAlt,
	className
}: {
	post: { slug: string; title: string; category: string; date: string }
	imgSrc: string
	imgAlt: string
	className?: string
}) => {
	return (
		<Link
			href={`/blog/${post.slug}`}
			key={post.slug}
			className={cn('group col-span-1 space-y-2 no-underline', className)}
		>
			<div className="relative aspect-square w-full overflow-hidden rounded-custom">
				<CustomImage
					src={imgSrc}
					alt={imgAlt}
					className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
				/>
				<div className="pointer-events-none absolute inset-0 rounded-custom bg-linear-to-t from-black/70 via-black/10 to-transparent" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-5">
					<p className="font-medium text-white text-xs backdrop-blur-sm">{formatDate(post.date)}</p>
					<p className="font-medium text-3xl text-white leading-snug">{post.title}</p>
				</div>
			</div>
		</Link>
	)
}
