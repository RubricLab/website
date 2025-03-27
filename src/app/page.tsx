'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { useFold } from '~/lib/hooks/use-fold'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Footer } from '~/ui/footer'
import { Albertsons } from '~/ui/logos/albertsons'
import { Cal } from '~/ui/logos/cal'
import { Graphite } from '~/ui/logos/graphite'
import { Partners } from '~/ui/partners'
import { ScrollButton } from '~/ui/scroll-button'
import { Testimonials } from '~/ui/testimonials'
import { Video } from '~/ui/video/video'

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

export default function Page() {
	const posthog = usePostHog()
	const { isBelowFold } = useFold()
	const hook = "We don't have a sales team. Let's talk."

	return (
		<div className="flex flex-col items-center">
			<Section className="relative h-screen">
				<div className="flex h-full w-full flex-col items-center justify-center">
					<div className="w-fit max-w-5xl">
						<h2 className="mb-4 text-2xl">
							We&apos;re an applied AI Lab helping companies get intelligence to production.
						</h2>
						<Video
							hlsUrl="https://d2os0zhpsj02b0.cloudfront.net/hero/hls/master.m3u8"
							mp4Url="https://d2os0zhpsj02b0.cloudfront.net/hero/preview.mp4"
							posterUrl="/images/video-thumbnail.jpg"
							transcriptionUrl="/transcripts/hero.vtt"
						/>
					</div>
				</div>
				<ScrollButton
					className={cn('absolute bottom-6 transition-opacity', { 'opacity-0': isBelowFold })}
				/>
			</Section>
			<Section className="space-y-40">
				<div className="flex w-full max-w-2xl flex-col items-center space-y-6">
					<div className="flex w-full items-center justify-between gap-4">
						<Link className="w-36" href="/work#Cal.com">
							<Cal className="w-full" />
						</Link>
						<Link className="w-40" href="/work#Graphite">
							<Graphite className="w-full" />
						</Link>
						<Link className="w-48" href="/work#Albertsons">
							<Albertsons className="w-full" />
						</Link>
					</div>
					<Link
						href="/work"
						className="text-sm"
						onClick={() => posthog.capture('projects.clicked', { body: 'See more', href: '/work' })}
					>
						See more
					</Link>
				</div>
				<Testimonials />
				<Partners />

				<div className="flex flex-col gap-8">
					<h2 className="max-w-2xl text-7xl">{hook}</h2>
					<div className="flex items-center gap-4">
						<Link
							href="/blog/introducing-rubric-labs"
							onClick={() =>
								posthog.capture('read_more.clicked', {
									body: 'Read more',
									hook,
									href: '/blog/introducing-rubric-labs'
								})
							}
						>
							<Button variant="outline">Read more</Button>
						</Link>
						<Link
							href="/contact"
							onClick={() =>
								posthog.capture('contact_us.clicked', {
									body: 'Get in touch',
									hook,
									href: '/contact'
								})
							}
						>
							<Button>Get in touch</Button>
						</Link>
					</div>
				</div>
			</Section>

			<Footer />
		</div>
	)
}
