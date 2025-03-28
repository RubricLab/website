import Link from 'next/link'

export const Testimonials = () => {
	return (
		<div className="w-full max-w-2xl space-y-20 sm:text-justify">
			<div className="flex flex-col">
				<p>
					<span className="text-secondary/50">
						"Rubric was an absolute pleasure to work with. They were available to meet on short notice and
						displayed an immense desire to meet our near-impossible deadlines. Their knowledge of
					</span>{' '}
					complex AI solutions
					<span className="text-secondary/50">
						{' '}
						is impressive. I will definitely be working with the Rubric team again soon."
					</span>
				</p>
				<span className="self-end text-secondary text-sm">Daniel Bevan</span>
				<span className="self-end text-secondary text-sm">
					CTO of <Link href="/work#Sligo">Sligo</Link>
				</span>
			</div>
			<div className="flex flex-col">
				<p>
					<span className="text-secondary/50">
						"In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
						experience that reached{' '}
					</span>
					thousands of users
					<span className="text-secondary/50">
						. They&apos;re fluent in novel technologies, creative, highly responsive, and went the extra
						mile to follow through and iterate with us even after initial handoff."
					</span>
				</p>
				<span className="self-end text-secondary text-sm">Merrill Lutsky</span>
				<span className="self-end text-secondary text-sm">
					Co-Founder of <Link href="/work#Graphite">Graphite</Link>
				</span>
			</div>
			<div className="flex flex-col">
				<p>
					<span className="text-secondary/50">
						"Working with Rubric has been like having a CTO in our back pocket. They pair the best in
						strategy with a killer product team to consistently deliver{' '}
					</span>
					on time, every time
					<span className="text-secondary/50">
						. From our first conversation when they took time to understand our business needs, I knew
						trusting them with our MVP build and every iteration since was the right choice."
					</span>
				</p>
				<span className="self-end text-secondary text-sm">Mitchell White</span>
				<span className="self-end text-secondary text-sm">
					Founder of <Link href="/work#Weave">Weave</Link>
				</span>
			</div>
		</div>
	)
}
