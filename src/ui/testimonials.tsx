import Link from 'next/link'

type TestimonialItem = {
	body: React.ReactNode
	author: string
	title: string
	company: string
	href: string
}

const testimonials: TestimonialItem[] = [
	{
		body: (
			<>
				<span className="text-secondary/50">"Rubric gave us the </span>
				tactical engineering firepower
				<span className="text-secondary/50">
					{' '}
					we needed as we rapidly scaled. Professional executors who came in, crushed the task and handed
					it off gracefully."
				</span>
			</>
		),
		author: 'Max Brodeur-Urbas',
		title: 'CEO',
		company: 'Gumloop',
		href: '/work#Gumloop'
	},
	{
		body: (
			<>
				<span className="text-secondary/50">
					"Rubric was an absolute pleasure to work with. They were available to meet on short notice and
					displayed an immense desire to meet our near-impossible deadlines. Their knowledge of
				</span>{' '}
				complex AI solutions
				<span className="text-secondary/50">
					{' '}
					is impressive. I will definitely be working with the Rubric team again soon."
				</span>
			</>
		),
		author: 'Daniel Bevan',
		title: 'CTO',
		company: 'Sligo',
		href: '/work#Sligo'
	},
	{
		body: (
			<>
				<span className="text-secondary/50">
					"In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
					experience that reached{' '}
				</span>
				thousands of users
				<span className="text-secondary/50">
					. They&apos;re fluent in novel technologies, creative, highly responsive, and went the extra
					mile to follow through and iterate with us even after initial handoff."
				</span>
			</>
		),
		author: 'Merrill Lutsky',
		title: 'CEO',
		company: 'Graphite',
		href: '/work#Graphite'
	},
	{
		body: (
			<>
				<span className="text-secondary/50">
					"Working with Rubric has been like having a CTO in our back pocket. They pair the best in
					strategy with a killer product team to consistently deliver{' '}
				</span>
				on time, every time
				<span className="text-secondary/50">
					. From our first conversation when they took time to understand our business needs, I knew
					trusting them with our MVP build and every iteration since was the right choice."
				</span>
			</>
		),
		author: 'Mitchell White',
		title: 'Founder',
		company: 'Weave',
		href: '/work#Weave'
	}
]

const Testimonial = ({ item }: { item: TestimonialItem }) => {
	return (
		<div className="flex flex-col">
			<p>{item.body}</p>
			<span className="self-end text-secondary text-sm">{item.author}</span>
			<span className="self-end text-secondary text-sm">
				{item.title} of <Link href={item.href}>{item.company}</Link>
			</span>
		</div>
	)
}

export const Testimonials = () => {
	return (
		<div className="w-full max-w-2xl space-y-20 sm:text-justify">
			{testimonials.map(item => (
				<Testimonial key={`${item.author}-${item.company}`} item={item} />
			))}
		</div>
	)
}
