import { cn } from '~/lib/utils/cn'

export const CustomImage = ({
	...props
}: { children?: React.ReactNode } & React.ImgHTMLAttributes<HTMLImageElement>) => {
	return (
		<span className="flex h-full flex-col gap-2">
			{(props.src as string)?.endsWith('.mp4') ? (
				<video src={props.src} autoPlay muted loop className={cn('h-full', props.className)}>
					<source src={props.src as string} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : (
				// biome-ignore lint/performance/noImgElement: techdebt
				<img {...props} alt={props.alt || 'Blog image'} className={cn('h-full', props.className)} />
			)}
			{props.title ? <span className="text-center text-secondary text-sm">{props.title}</span> : null}
		</span>
	)
}
