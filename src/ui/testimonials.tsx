import Link from 'next/link'

export const Testimonials = () => {
	return (
		<div className="w-full max-w-2xl space-y-20 sm:text-justify">
			<div className="space-y-4">
				<p>
					<span className="text-secondary/50">
						"Rubric was an absolute pleasure to work with. They were available to meet on short notice and
						displayed an immense desire to meet our near-impossible deadlines. Their knowledge of
					</span>{' '}
					complex AI solutions
					<span className="text-secondary/50">
						{' '}
						is impressive. I will definitely be working with the Rubric team again soon. - Daniel Bevan,
						CTO of{' '}
						<Link className="opacity-50" href="/work#Sligo">
							Sligo
						</Link>
					</span>
				</p>
			</div>
			<div className="space-y-4">
				<p>
					<span className="text-secondary/50">
						"In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
						experience that reached{' '}
					</span>
					thousands of users
					<span className="text-secondary/50">
						. They&apos;re fluent in novel technologies, creative, highly responsive, and went the extra
						mile to follow through and iterate with us even after initial handoff." - Merrill Lutsky,
						Co-Founder of{' '}
						<Link className="opacity-50" href="/work#Graphite">
							Graphite
						</Link>
					</span>
				</p>
			</div>
			<div className="space-y-4">
				<p>
					<span className="text-secondary/50">
						"Working with Rubric has been like having a CTO in our back pocket. They pair the best in
						strategy with a killer product team to consistently deliver{' '}
					</span>
					on time, every time
					<span className="text-secondary/50">
						. From our first conversation when they took time to understand our business needs, I knew
						trusting them with our MVP build and every iteration since was the right choice." - Mitchell
						White, Founder of{' '}
						<Link className="opacity-50" href="/work#Weave">
							Weave
						</Link>
					</span>
				</p>
			</div>
		</div>
	)
}
