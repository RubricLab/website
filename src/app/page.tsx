import Image from 'next/image'
import Link from 'next/link'
import blog from '~/app/images/blog.webp'
import blog2 from '~/app/images/blur.jpeg'
import cool from '~/app/images/cool.jpeg'
import warm from '~/app/images/warm.jpeg'
import { getPostSlugs } from '~/lib/constants/posts'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Cal } from '~/ui/logos/cal'
import { Gumloop } from '~/ui/logos/gumloop'
import { Rubric } from '~/ui/logos/rubric'
import { Testimonials } from '~/ui/testimonials'
import { WorkTable } from '~/ui/work-table'

export default async function Page() {
	const slugs = await getPostSlugs()
	const posts = await Promise.all(
		slugs.map(async slug => {
			const { metadata } = await import(`~/lib/constants/posts/${slug}.mdx`)
			return { slug, ...metadata }
		})
	)

	return (
		<div className="flex items-start gap-16 overflow-x-scroll">
			<div className="flex h-screen w-full shrink-0 flex-col items-center">
				<div className="flex h-full w-full max-w-5xl flex-col justify-center space-y-8">
					<div className="group relative h-full max-h-[560px] w-full overflow-hidden">
						<video autoPlay muted loop className="h-full w-full object-cover">
							<source src="/hero.mp4" type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Rubric className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-12 w-12" />
					</div>
					<p className="max-w-1/2 text-lg">
						We&apos;re an applied AI Lab helping companies deploy intelligence at scale, building the next
						generation of personalized software, enabled by AI.
					</p>
				</div>
			</div>
			<div className="flex h-[200vh] w-full shrink-0 flex-col items-center">
				<div className="flex h-screen w-full max-w-5xl shrink-0 flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={warm} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Gumloop className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32" />
					</div>
					<div className="flex justify-between gap-8">
						<h2>Gumloop</h2>
						<div className="flex w-1/2 flex-col gap-4">
							<p>
								A UI system built to scale to infinite AI workflows. How we worked with Gumloop to capture
								the imagination of a new class of builder.
							</p>
							<Button>View project</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full shrink-0 flex-col items-center">
				<div className="flex h-screen w-full max-w-5xl flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={cool} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Cal className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32" />
					</div>
					<div className="flex justify-between gap-8">
						<h2>Cal.ai</h2>
						<div className="flex w-1/2 flex-col gap-4">
							<p>
								A system to manage your calendar with words. How one of the first agentic products to market
								started.
							</p>
							<Button>View project</Button>
						</div>
					</div>
				</div>
				<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-8 py-20">
					<div className="w-full max-w-5xl space-y-8">
						<h2>Work</h2>
						<WorkTable />
					</div>
				</div>
				<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-8 py-20">
					<Testimonials />
				</div>
				<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-8 py-20">
					<div className="flex w-full max-w-3xl flex-col items-center space-y-16">
						<h2>Latest blog posts</h2>
						<div className="grid grid-cols-8 gap-16">
							{posts.slice(0, 2).map((post, index) => (
								<Link
									href={`/blog/${post.slug}`}
									key={post.slug}
									className={cn('col-span-4 space-y-2 text-left', index % 2 === 1 ? 'translate-y-16' : '')}
								>
									<div className="relative aspect-square w-full">
										<Image src={Math.random() > 0.5 ? blog : blog2} alt="Abstract plant image" fill />
									</div>
									<p className="max-w-full pt-4 text-lg">{post.title}</p>
									<div className="flex gap-4 text-sm">
										<p className="font-mono">{post.category}</p>
										<p className="opacity-50">{post.date}</p>
									</div>
								</Link>
							))}
						</div>
						<Link href="/blog">
							<Button>See more</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
