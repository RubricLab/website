export const PauseIcon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg {...rest} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<title>Pause icon</title>
			<rect x="6" y="4" width="4" height="16" />
			<rect x="14" y="4" width="4" height="16" />
		</svg>
	)
}
