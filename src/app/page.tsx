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
			'flex w-screen shrink-0 flex-col items-center p-4 py-12 sm:p-24',
			className
		)}
	>
		{children}
	</div>
)

const capabilities = [
	{
		title: 'AI Product Engineering',
		description: 'We design and build production AI systems — from LLM-powered features to full autonomous workflows.'
	},
	{
		title: 'Rapid Prototyping & MVPs',
		description: 'Go from concept to working product in weeks, not months. We ship fast and iterate with you.'
	},
	{
		title: 'Technical Strategy',
		description: 'We help teams pick the right models, architectures, and tooling — so you build on solid ground.'
	}
]

const WhatWeDo = () => (
	<div className="flex w-full max-w-2xl flex-col gap-8">
		<h3 className="text-secondary text-sm">What we do</h3>
		<div className="grid gap-8 sm:grid-cols-3">
			{capabilities.map(cap => (
				<div key={cap.title} className="flex flex-col gap-2">
					<h4 className="text-base font-medium">{cap.title}</h4>
					<p className="text-secondary text-sm leading-relaxed">{cap.description}</p>
				</div>
			))}
		</div>
	</div>
)

const Hero = () => {
	const { isBelowFold } = useFold()
	return (
		<Section className="relative h-screen min-h-screen">
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div className="w-fit max-w-5xl">
					<h2 className="mb-4 text-2xl">
						We ship AI products — from prototype to production — for companies that need to move fast.
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
			<Section className="space-y-24">
				<WhatWeDo />
				<TrustedBy />
				<Testimonials />
				<Partners />
				<CTA />
			</Section>
			<Footer />
		</div>
	)
}
