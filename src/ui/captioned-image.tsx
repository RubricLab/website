export const CaptionedImage = ({
	children,
	...props
}: { children: React.ReactNode } & React.ImgHTMLAttributes<HTMLImageElement>) => {
	return (
		<span className="flex flex-col gap-2">
			{props.src?.endsWith('.mp4') ? (
				<video src={props.src} autoPlay muted loop>
					<source src={props.src} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : (
				<img {...props} alt={props.alt || 'Blog image'} />
			)}
			{props.title ? <span className="text-secondary text-xs">{props.title}</span> : null}
		</span>
	)
}
