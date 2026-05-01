type BlogTestimonialProps = {
	quote: string
	name?: string
	role?: string
}

export const BlogTestimonial = ({ quote, name, role }: BlogTestimonialProps) => {
	return (
		<div className="flex flex-col gap-0">
			<blockquote>"{quote}"</blockquote>
			{(name || role) && (
				<div className="flex flex-col items-end text-sm">
					{name && <p>{name}</p>}
					{role && <p>{role}</p>}
				</div>
			)}
		</div>
	)
}
