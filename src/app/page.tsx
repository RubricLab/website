'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { useFold } from '~/lib/hooks/use-fold'
import { cn } from '~/lib/utils/cn'
import { CTA } from '~/ui/cta'
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
					<p className="text-secondary text-sm">Trusted by</p>
					<div className="grid w-full grid-cols-3 gap-4">
						<div className="flex justify-start">
							<Link className="w-36" href="/work#Cal.com">
								<Cal className="w-full" />
							</Link>
						</div>
						<div className="flex justify-center">
							<Link className="w-40" href="/work#Graphite">
								<Graphite className="w-full" />
							</Link>
						</div>
						<div className="flex justify-end">
							<Link className="w-48" href="/work#Albertsons">
								<Albertsons className="w-full" />
							</Link>
						</div>
					</div>
					<Link
						href="/work"
						className="text-sm"
						onClick={() => posthog.capture('projects.clicked', { body: 'View more', href: '/work' })}
					>
						View more
					</Link>
				</div>
				<Testimonials />
				<Partners />
				<CTA />
			</Section>
			<Footer />
		</div>
	)
}
