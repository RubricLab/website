import Link from 'next/link'
import type { ReactNode } from 'react'
import SectionLayout from './SectionLayout'

const comments = [
	{
		author: {
			name: 'Daniel Bevan',
			href: 'https://design.danielbevan.com',
			company: 'DB Designs'
		},
		comment: (
			<p className="font-thin text-tertiary text-xl">
				Rubric was an absolute pleasure to work with. They were available to meet on short notice and
				displayed an immense desire to meet our near-impossible deadlines.{' '}
				<span className="font-normal text-primary">
					Their knowledge of complex AI solutions is impressive.
				</span>{' '}
				I will definitely be working with the Rubric team again soon.
			</p>
		)
	},
	{
		author: {
			name: 'Merrill Lutsky',
			href: 'https://graphite.dev',
			company: 'Graphite'
		},
		comment: (
			<p className="font-thin text-tertiary text-xl">
				In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
				experience that reached thousands of users. They&apos;re{' '}
				<span className="font-normal text-primary">
					fluent in novel technologies, creative, highly responsive,
				</span>{' '}
				and went the extra mile to follow through and iterate with us even after initial handoff.
			</p>
		)
	},
	{
		author: {
			name: 'Mitchell White',
			href: 'https://glassboxbarbershop.com/',
			company: 'Blade'
		},
		comment: (
			<p className="font-thin text-tertiary text-xl">
				<span className="font-normal text-primary">
					Working with Rubric has been like having a CTO in our back pocket.
				</span>{' '}
				They pair the best in strategy with a killer product team to consistently deliver on time every
				time. From our first conversation when they took time to understand our business needs, I knew
				trusting them with our MVP build and every iteration since was the right choice.
			</p>
		)
	}
]

function Testimonial({
	comment,
	author
}: {
	comment: ReactNode
	author: { name: string; href: string; company: string }
}) {
	return (
		<div className="flex flex-col justify-between gap-3 rounded-md bg-neutral-100 p-5 lg:w-[30vw] dark:bg-neutral-900">
			{comment}
			<div className="flex w-full flex-col items-end">
				<Link className="font-semibold text-lg text-tertiary no-underline" href={author.href}>
					{author.name}
				</Link>
				<p className="text-tertiary opacity-60">{author.company}</p>
			</div>
		</div>
	)
}

export default function Testimonials() {
	return (
		<SectionLayout id="testimonials" className="from-white to-white dark:from-black dark:to-black">
			<div className="flex flex-col items-center">
				<h1>Loved by the best.</h1>
				<h3>Read what folks have to say about us.</h3>
			</div>
			<div className="flex flex-col gap-10 lg:flex-row 2xl:flex-col">
				{comments.map(item => (
					<Testimonial key={item.author.name} author={item.author} comment={item.comment} />
				))}
			</div>
		</SectionLayout>
	)
}
