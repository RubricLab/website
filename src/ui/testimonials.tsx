export const Testimonials = () => {
	return (
		<table className="w-full max-w-3xl border-collapse border border-subtle">
			<thead>
				<tr>
					<th className="space-y-2 p-6 text-left">
						<h2>Trusted by the best</h2>
						<p className="text-secondary">Kind words from people we&apos;ve worked with</p>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className="space-y-2 border border-subtle p-6 align-top text-lg">
						<p>
							“Rubric was an absolute pleasure to work with. They were available to meet on short notice
							and displayed an immense desire to meet our near-impossible deadlines. Their knowledge of
							complex AI solutions is impressive. I will definitely be working with the Rubric team again
							soon.”
						</p>
						<p className="text-secondary">Daniel Bevan, DB Designs</p>
					</td>
					<td className="space-y-2 border border-subtle p-6 align-top text-lg">
						<p>
							“In just a few weeks, Rubric went from initial concepts to delivering an engaging AI video
							experience that reached thousands of users. They&apos;re fluent in novel technologies,
							creative, highly responsive, and went the extra mile to follow through and iterate with us
							even after initial handoff.”
						</p>
						<p className="text-secondary">Merrill Lutsky, Graphite</p>
					</td>
				</tr>
				<tr>
					<td className="space-y-2 border border-subtle p-6 align-top text-lg">
						<p>
							“Working with Rubric has been like having a CTO in our back pocket. They pair the best in
							strategy with a killer product team to consistently deliver on time every time. From our
							first conversation when they took time to understand our business needs, I knew trusting them
							with our MVP build and every iteration since was the right choice.”
						</p>
						<p className="text-secondary">Mitchel White, Blade</p>
					</td>
					<td />
				</tr>
			</tbody>
		</table>
	)
}
