export const Rubric = ({ className }: { className?: string }) => {
	return (
		<svg
			xmlns="https://www.w3.org/2000/svg"
			viewBox="0 0 99 99"
			className={className}
			shapeRendering="crispEdges"
		>
			<title>Rubric</title>
			<rect x="0" y="0" width="33" height="33" fill="currentColor" />
			<rect x="66" y="0" width="33" height="33" fill="currentColor" />
			<rect x="0" y="33" width="66" height="33" fill="currentColor" />
			<rect x="0" y="66" width="33" height="33" fill="currentColor" />
		</svg>
	)
}
