import { cn } from '~/lib/utils/cn'

export const CaptionedImage = ({
	...props
}: { children?: React.ReactNode } & React.ImgHTMLAttributes<HTMLImageElement>) => {
	return (
		<span className="flex h-full flex-col gap-2">
			{props.src?.endsWith('.mp4') ? (
				<video src={props.src} autoPlay muted loop className={cn('h-full', props.className)}>
					<source src={props.src} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : (
				<img {...props} alt={props.alt || 'Blog image'} className={cn('h-full', props.className)} />
			)}
			{props.title ? <span className="text-secondary text-xs">{props.title}</span> : null}
		</span>
	)
}
