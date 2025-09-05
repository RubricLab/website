'use client'

import { useFold } from '~/lib/hooks/use-fold'
import { cn } from '~/lib/utils/cn'
import { CTA } from '~/ui/cta'
import { Footer } from '~/ui/footer'
import { Partners } from '~/ui/partners'
import { ScrollButton } from '~/ui/scroll-button'
import { Testimonials } from '~/ui/testimonials'
import { TrustedBy } from '~/ui/trusted-by'
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

const Hero = () => {
	const { isBelowFold } = useFold()
	return (
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
	)
}

export default function Page() {
	return (
		<div className="flex flex-col items-center">
			<Hero />
			<Section className="space-y-40">
				<TrustedBy />
				<Testimonials />
				<Partners />
				<CTA hook="We don't have a sales team. Let's talk." />
			</Section>
			<Footer />
		</div>
	)
}
