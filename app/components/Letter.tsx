import Link from 'next/link'

export default function Letter() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-white p-8 dark:bg-black'>
			<div className='flex flex-col gap-8'>
				<div className='flex max-w-3xl flex-col gap-5'>
					<h1 className='text-7xl'>A note to the builders.</h1>
					<p>
						Hello world! We&apos;re Rubric. A nomadic team of engineers and artists
						working on the next generation of technology.
					</p>
					<p>
						We have been tinkering, hacking, breaking and building for over a decade
						and could not be more excited and optimistic about the future.
					</p>
					<p>
						Artificial Intelligence is a full fledged platform shift, akin to the
						invention of the internet. We believe that it is important to approach
						this shift with a child-like sense of wonder. To be bold, curious and
						open.
					</p>
					<p>
						Over our careers, we have built a framework for problem solving that
						prioritizes simple, fast and scalable solutions to complex problems and
						approach all of our projects with empathy for the people that use them.
					</p>
					<p>
						We want to sit down with you, skip the BS, break the rules and figure out
						how we can add value. We commit to being honest, open and fun. If you have
						an idea, project or problem, drop us a line. Let&apos;s melt some servers.
					</p>
				</div>

				<div className='flex w-full flex-col gap-2 '>
					<p className='text-base italic'>Signed,</p>
					<p className='font-semibold'>
						<Link
							className='underline-offset-4 hover:underline'
							href='https://twitter.com/dexterstorey'>
							Dexter
						</Link>
						,{' '}
						<Link
							className='underline-offset-4 hover:underline'
							href='https://twitter.com/sarimrmalik'>
							Sarim
						</Link>
						, and{' '}
						<Link
							className='underline-offset-4 hover:underline'
							href='https://twitter.com/tedspare'>
							Ted
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	)
}
