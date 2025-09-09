import Link from 'next/link'

export const Testimonials = () => {
	return (
		<div className="w-full max-w-2xl space-y-8 sm:text-justify">
			<div className="flex flex-col rounded-xl border-1 border-gray-200 bg-white p-5 shadow-sm dark:border-gray-900 dark:bg-transparent">
				<p className="text-base text-gray-700 leading-relaxed dark:text-gray-300">
					Rubric was an absolute pleasure to work with. They were available to meet on short notice and
					displayed an immense desire to meet our near-impossible deadlines. Their knowledge of{' '}
					<span className="font-bold text-gray-900 dark:text-gray-100">complex AI solutions</span> is
					impressive. I will definitely be working with the Rubric team again soon.
				</p>
				<div className="mt-4 flex flex-col items-end text-sm">
					<span className="font-medium text-gray-900 dark:text-gray-100">Daniel Bevan</span>
					<span className="text-gray-600 dark:text-gray-400">
						CTO of{' '}
						<Link className="underline underline-offset-2" href="/work#Sligo">
							Sligo
						</Link>
					</span>
				</div>
			</div>
			<div className="flex flex-col rounded-xl border-1 border-gray-200 bg-white p-5 shadow-sm dark:border-gray-900 dark:bg-transparent">
				<p className="text-base text-gray-700 leading-relaxed dark:text-gray-300">
					In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
					experience that reached{' '}
					<span className="font-bold text-gray-900 dark:text-gray-100">thousands of users</span>.
					They&apos;re fluent in novel technologies, creative, highly responsive, and went the extra mile
					to follow through and iterate with us even after initial handoff.
				</p>
				<div className="mt-4 flex flex-col items-end text-sm">
					<span className="font-medium text-gray-900 dark:text-gray-100">Merrill Lutsky</span>
					<span className="text-gray-600 dark:text-gray-400">
						Co-Founder of{' '}
						<Link className="underline underline-offset-2" href="/work#Graphite">
							Graphite
						</Link>
					</span>
				</div>
			</div>
			<div className="flex flex-col rounded-xl border-1 border-gray-200 bg-white p-5 shadow-sm dark:border-gray-900 dark:bg-transparent">
				<p className="text-base text-gray-700 leading-relaxed dark:text-gray-300">
					Working with Rubric has been like having a CTO in our back pocket. They pair the best in
					strategy with a killer product team to consistently deliver{' '}
					<span className="font-bold text-gray-900 dark:text-gray-100">on time, every time</span>. From
					our first conversation when they took time to understand our business needs, I knew trusting
					them with our MVP build and every iteration since was the right choice.
				</p>
				<div className="mt-4 flex flex-col items-end text-sm">
					<span className="font-medium text-gray-900 dark:text-gray-100">Mitchell White</span>
					<span className="text-gray-600 dark:text-gray-400">
						Founder of{' '}
						<Link className="underline underline-offset-2" href="/work#Weave">
							Weave
						</Link>
					</span>
				</div>
			</div>
		</div>
	)
}
