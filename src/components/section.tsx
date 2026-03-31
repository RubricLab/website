type SectionProps = {
	children: React.ReactNode
	className?: string
	id?: string
}

export function Section({ children, className, id }: SectionProps) {
	return (
		<section
			id={id}
			className={`mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32 ${className ?? ''}`}
		>
			{children}
		</section>
	)
}
