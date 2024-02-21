import Link from 'next/link'

const comments = [
	{
		author: {
			name: 'Daniel Bevan',
			href: 'https://design.danielbevan.com',
			company: 'DB Designs'
		},
		comment:
			'Rubric was an absolute pleasure to work with. They were available to meet on short notice and displayed an immense desire to meet our near-impossible deadlines. Their knowledge of complex AI solutions is impressive. I will definitely be working with the Rubric team again soon.'
	},
	{
		author: {
			name: 'Merrill Lutsky',
			href: 'https://graphite.dev',
			company: 'Graphite'
		},
		comment:
			"In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video experience that reached thousands of users. They're fluent in novel technologies, creative, highly responsive, and went the extra mile to follow through and iterate with us even after initial handoff."
	}
]

function Testimonial({
	comment,
	author
}: {
	comment: string
	author: {name: string; href: string; company: string}
}) {
	return (
		<div className='flex flex-col gap-3 rounded-md bg-white p-5 sm:w-[30vw] dark:bg-black'>
			<p className='text-xl font-thin'>{comment}</p>
			<div className='flex w-full items-center justify-end gap-1'>
				<Link
					className='font-semibold no-underline'
					href={author.href}>
					{author.name}
				</Link>
				<p className='opacity-60'>{author.company}</p>
			</div>
		</div>
	)
}

export default function Testimonials() {
	return (
		<div
			id='testimonials'
			className='flex min-h-screen flex-col items-center justify-center gap-16 bg-neutral-100 p-8 dark:bg-neutral-900'>
			<div className='flex flex-col items-center text-center'>
				<h1>Loved by the best.</h1>
				<h3>Read what folks have to say about us.</h3>
			</div>
			<div className='flex flex-col gap-10 sm:flex-row'>
				{comments.map(item => (
					<Testimonial
						key={item.author.name}
						author={item.author}
						comment={item.comment}
					/>
				))}
			</div>
		</div>
	)
}
