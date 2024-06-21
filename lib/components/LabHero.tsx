import Link from 'next/link'

export default function LabHero() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-5 sm:px-0'>
			<div className='flex w-full max-w-3xl flex-col gap-5'>
				<h1>The Lab</h1>
				<p>
					Our vision for the lab is to engineer the earliest stage in a
					product&apos;s lifecycle — the path to Product Market Fit (PMF).
				</p>
				<p>
					Recent AI capabilities have made it apparent that the barrier to building
					software is going to zero.
				</p>
				<p>Software will be abundant.</p>
				<p>
					So who will win in an abundant world? Engineers with a growth mindset.
				</p>
				<p>
					Our vision for the lab is to systemize the path to finding PMF, one
					experiment at a time.
				</p>
				<p>
					We&apos;re learning in public. We will make mistakes, but one thing is for
					certain, we will share all our findings in our{' '}
					<Link href='/blog'>Blog</Link> and{' '}
					<Link href='/newsletter'>Newsletter</Link>.
				</p>
			</div>
		</div>
	)
}
