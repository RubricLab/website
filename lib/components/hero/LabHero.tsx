import Link from 'next/link'

export default function LabHero() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-8'>
			<div className='flex w-full max-w-3xl flex-col gap-5'>
				<h1>The Lab</h1>
				<p>
					Our vision for the lab is to engineer the earliest stage in a
					product&apos;s lifecycle — the path to Product Market Fit, or PMF for
					short.
				</p>
				<p>
					Recent AI capabilities have made it apparent that the barrier to entry to
					software is going to zero.
				</p>
				<p>Software will be abundant.</p>
				<p>
					So who will win in an abundant world? Folks whose core skillset will be
					finding PMF.
				</p>
				<p>
					Our vision for the lab is to systemize the path to finding PMF, one
					experiment at a time.
				</p>
				<p>
					We&apos;re also doing this in the open. You&apos;ll find most of our
					findings in our <Link href='/blog'>Blog</Link> and{' '}
					<Link href='/newsletter'>Newsletter</Link>.
				</p>
				<p>
					We don&apos;t want to come off as this know all time. Most of our ideas are
					based off intution and insights from building software over the last
					decade.
				</p>
			</div>
		</div>
	)
}
