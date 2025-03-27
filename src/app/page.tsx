'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
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

	return (
		<div className="flex flex-col items-center">
			<Section className="relative h-screen">
				<div className="flex h-full w-full flex-col items-start justify-center gap-4">
					<p className="shrink-0 text-lg sm:max-w-2/3">
						We&apos;re an applied AI Lab helping companies get intelligence to production.
					</p>
					<div className="aspect-video w-full overflow-hidden">
						<Video
							hlsUrl="https://d2os0zhpsj02b0.cloudfront.net/hero/hls/master.m3u8"
							mp4Url="https://d2os0zhpsj02b0.cloudfront.net/hero/preview.mp4"
							posterUrl="/images/video-thumbnail.jpg"
							transcriptionUrl="/transcripts/hero.vtt"
						/>
					</div>
				</div>
				<ScrollButton className="absolute bottom-6" />
			</Section>
			<Section className="space-y-40">
				<div className="flex w-full flex-col items-center space-y-6">
					<div className="flex w-full max-w-2xl items-center justify-between">
						<Cal className="w-40" />
						<Graphite className="w-40" />
						<Albertsons className="w-48" />
					</div>
					<Link
						href="/work"
						onClick={() => posthog.capture('projects.clicked', { body: 'See more', href: '/work' })}
					>
						See more
					</Link>
				</div>
				<Testimonials />
				<Partners />
				<h2 className="max-w-2xl text-7xl">
					We&apos;re a small team of startup builders. We could be talking tomorrow.
				</h2>
				<div className="flex items-center gap-4">
					<Link
						href="/blog/introducing-rubric-labs"
						onClick={() =>
							posthog.capture('read_more.clicked', {
								body: 'Read more',
								href: '/blog/introducing-rubric-labs'
							})
						}
					>
						<Button variant="outline">Read more</Button>
					</Link>
					<Link
						href="/contact"
						onClick={() =>
							posthog.capture('contact_us.clicked', { body: 'Get in touch', href: '/contact' })
						}
					>
						<Button>Get in touch</Button>
					</Link>
				</div>
			</Section>

			<Footer />
		</div>
	)
}
