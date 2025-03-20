import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/lib/utils/cn'
import { getPostMetadata } from '~/lib/utils/posts'
import { Button } from '~/ui/button'
import { Footer } from '~/ui/footer'
import { Cal } from '~/ui/logos/cal'
import { DRisk } from '~/ui/logos/drisk'
import { Gumloop } from '~/ui/logos/gumloop'
import { Maige } from '~/ui/logos/maige'
import { Rubric } from '~/ui/logos/rubric'
import { Testimonials } from '~/ui/testimonials'
import { WorkTable } from '~/ui/work-table'
import { Card } from './(rest)/blog/card'
import { HorizontalScroll } from './content'

type Project = {
	name: string
	description: string
	image: string
	link: string
	Icon: ({ className }: { className: string }) => React.ReactNode
}

const projects = [
	{
		name: 'Gumloop',
		description:
			'A UI system built to scale to infinite AI workflows. How we worked with Gumloop to capture the imagination of a new class of builder.',
		image: '/images/warm.jpeg',
		link: '/gumloop',
		Icon: ({ className }) => <Gumloop className={className} />
	},
	{
		name: 'dRisk',
		description:
			'A platform processing millions of pages of financial reports 24/7. How we optimized LLM use for scale.',
		image: '/images/cool.jpeg',
		link: '/drisk',
		Icon: ({ className }) => <DRisk className={className} />
	},
	{
		name: 'Maige',
		description:
			'A profitable AI codebase copilot. Why we open-sourced a product that benefits from each new generation of LLMs.',
		image: '/images/warm.jpeg',
		link: '/maige',
		Icon: ({ className }) => <Maige className={cn(className, '!w-10')} />
	},
	{
		name: 'Cal.ai',
		description:
			'A system to manage your calendar with words. How one of the first agentic products to market started.',
		image: '/images/warm.jpeg',
		link: '/cal',
		Icon: ({ className }) => <Cal className={className} />
	}
] satisfies Project[]

const Section = ({ children }: { children: React.ReactNode }) => (
	<div className="flex w-screen shrink-0 flex-col items-center p-24">{children}</div>
)

export default async function Page() {
	const posts = await getPostMetadata()
	return (
		<HorizontalScroll>
			<Section>
				<div className="flex h-full w-full flex-col items-start justify-center space-y-8">
					<div className="group relative h-full max-h-[560px] w-full overflow-hidden">
						<video autoPlay muted loop className="h-full w-full object-cover">
							<source src="/images/hero.mp4" type="video/mp4" />
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
			</Section>
			{projects.slice(0, -1).map(project => (
				<Section key={project.name}>
					<div className="flex h-full w-full shrink-0 flex-col justify-center space-y-8">
						<div className="relative h-full max-h-[560px] w-full overflow-hidden">
							<Image fill className="object-cover" src={project.image} alt="Rubric Labs" />
							<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
							<project.Icon className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32" />
						</div>
						<div className="flex justify-between gap-8">
							<h2>{project.name}</h2>
							<div className="flex w-1/2 flex-col gap-4">
								<p>{project.description}</p>
								<Button>View project</Button>
							</div>
						</div>
					</div>
				</Section>
			))}
			<div className="flex min-h-screen w-screen shrink-0 flex-col items-center p-24">
				<div className="flex h-full w-full shrink-0 flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={'/images/cool.jpeg'} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						{projects
							.at(-1)
							?.Icon({ className: '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32' })}
					</div>
					<div className="flex justify-between gap-8">
						<h2>{projects.at(-1)?.name}</h2>
						<div className="flex w-1/2 flex-col gap-4">
							<p>{projects.at(-1)?.description}</p>
							<Button>View project</Button>
						</div>
					</div>
				</div>
				<div className="flex h-fit min-h-screen w-screen shrink-0 flex-col items-center justify-center gap-8 py-20">
					<div className="w-full max-w-5xl space-y-8">
						<h2>Work</h2>
						<WorkTable />
					</div>
				</div>
				<div className="flex min-h-screen w-screen shrink-0 flex-col items-center justify-center gap-8 py-20">
					<Testimonials />
				</div>
				<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-8 py-20">
					<div className="flex w-full max-w-3xl flex-col items-center space-y-16">
						<h2>Latest blog posts</h2>
						<div className="grid grid-cols-8 gap-16">
							{posts.slice(0, 2).map(post => (
								<Card imgSrc={post.bannerImageUrl} imgAlt={post.title} key={post.slug} post={post} />
							))}
						</div>
						<Link href="/blog">
							<Button>See more</Button>
						</Link>
					</div>
				</div>
				<Footer />
			</div>
		</HorizontalScroll>
	)
}
