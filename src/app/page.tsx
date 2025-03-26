import Link from 'next/link'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Footer } from '~/ui/footer'
import { Albertsons } from '~/ui/logos/albertsons'
import { Cal } from '~/ui/logos/cal'
import { Graphite } from '~/ui/logos/graphite'
import { Langchain } from '~/ui/logos/langchain'
import { Neon } from '~/ui/logos/neon'
import { Vercel } from '~/ui/logos/vercel'
import { ScrollButton } from '~/ui/scroll-button'
import { Testimonials } from '~/ui/testimonials'
import VimeoPlayer from '~/ui/video'

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<div
		className={cn(
			'flex min-h-screen w-screen shrink-0 flex-col items-center p-4 py-12 sm:p-24',
			className
		)}
	>
		{children}
	</div>
)

export default async function Page() {
	return (
		<div className="flex flex-col items-center">
			<Section className="relative h-screen">
				<div className="flex h-full w-full flex-col items-start justify-center gap-4">
					<p className="shrink-0 text-lg sm:max-w-2/3">
						We&apos;re an applied AI Lab helping companies get intelligence to production.
					</p>
					<div className="aspect-video w-full overflow-hidden">
						<VimeoPlayer videoId={1069128661} thumbnailUrl="/images/video-thumbnail.png" />
					</div>
				</div>
				<ScrollButton className="absolute bottom-6" />
			</Section>
			<Section className="space-y-32">
				<div className="flex w-full flex-col items-center space-y-8">
					<div className="flex w-full items-center justify-between">
						<Cal className="w-40" />
						<Graphite className="w-40" />
						<Albertsons className="w-48" />
					</div>
					<Link href="/work" className="text-sm">
						See more
					</Link>
				</div>
				<Testimonials />
				<div className="flex w-full max-w-2xl flex-col items-center space-y-8">
					<p className="text-secondary">our partners</p>
					<div className="flex w-full items-center justify-between">
						<Link href="https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true">
							<Neon className="w-36" />
						</Link>
						<Link href="https://vercel.com/partners/solution-partners/rubriclabs">
							<Vercel className="w-40" />
						</Link>
						<Link href="https://langchain.com/experts">
							<Langchain className="w-44" />
						</Link>
					</div>
				</div>
				<h2 className="max-w-2xl text-7xl">
					We&apos;re a small team of startup builders. We could be talking tomorrow.
				</h2>
				<div className="flex items-center gap-4">
					<Link href="/blog/introducing-rubric-labs">
						<Button variant="outline">Read more</Button>
					</Link>
					<Link href="/contact">
						<Button>Get in touch</Button>
					</Link>
				</div>
			</Section>

			<Footer />
		</div>
	)
}
