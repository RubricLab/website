export const RestartIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className={className}
			aria-hidden="true"
		>
			<title>Restart icon</title>
			<path
				d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
