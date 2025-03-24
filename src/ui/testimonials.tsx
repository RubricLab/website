import Link from 'next/link'

export const Testimonials = () => {
	return (
		<div className="w-full max-w-3xl">
			<div className="space-y-2 border border-subtle border-b-0 p-6">
				<h2>Trusted by the best</h2>
				<p className="text-secondary">Kind words from people we&apos;ve worked with</p>
			</div>
			<div className="grid gap-0 text-secondary sm:grid-cols-2">
				<div className="space-y-2 border border-subtle p-6 text-lg">
					<p>
						"Rubric was an absolute pleasure to work with. They were available to meet on short notice and
						displayed an immense desire to meet our near-impossible deadlines. Their{' '}
						<span className="text-primary">knowledge of complex AI solutions is impressive</span>. I will
						definitely be working with the Rubric team again soon."
					</p>
					<p className="mt-10">
						Daniel Bevan, <Link href="https://sligo.ai">Sligo</Link>
					</p>
				</div>
				<div className="space-y-2 border border-subtle border-t-0 p-6 text-lg sm:border-t sm:border-l-0">
					<p>
						"In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
						experience that reached thousands of users. They&apos;re{' '}
						<span className="text-primary">
							fluent in novel technologies, creative, highly responsive
						</span>
						, and went the extra mile to follow through and iterate with us even after initial handoff."
					</p>
					<p>
						Merrill Lutsky, <Link href="https://graphite.dev">Graphite</Link>
					</p>
				</div>
				<div className="space-y-2 border border-subtle border-t-0 p-6 text-lg">
					<p>
						"Working with Rubric has been like having a CTO in our back pocket. They pair{' '}
						<span className="text-primary">
							the best in strategy with a killer product team to consistently deliver on time
						</span>
						, every time. From our first conversation when they took time to understand our business
						needs, I knew trusting them with our MVP build and every iteration since was the right
						choice."
					</p>
					<p>
						Mitchell White, <Link href="https://www.weavein.co/login">Weave</Link>
					</p>
				</div>
				<div className="border-subtle sm:border-r sm:border-b" />
			</div>
		</div>
	)
}
