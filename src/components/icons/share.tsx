export const ShareIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className={className}
			aria-hidden="true"
		>
			<title>Share icon</title>
			<path d="M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M8 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M20 21H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h3m10 0h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
