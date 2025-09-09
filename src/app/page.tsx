'use client'

// import { useFold } from '~/lib/hooks/use-fold'
import { cn } from '~/lib/utils/cn'
// import { Button } from '~/ui/button'
import { CTA } from '~/ui/cta'
import { Chat } from '~/ui/demo/chat'
import { Footer } from '~/ui/footer'
// import { Arrow } from '~/ui/icons/arrow'
import { Partners } from '~/ui/partners'
import { Testimonials } from '~/ui/testimonials'
import { TrustedBy } from '~/ui/trusted-by'
import { Video } from '~/ui/video/video'

// import { VimeoVideo } from '~/ui/video/vimeo-video'

// import { Video } from '~/ui/video/video'

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
	// const { isBelowFold } = useFold()
	return (
		<Section className="relative h-screen">
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div className="flex w-fit max-w-5xl flex-col items-center gap-24">
					<div className="flex flex-col items-center gap-4">
						<h1 className="text-2xl">Rubric Agency</h1>
						<h1 className="mb-4 text-4xl">
							We build{' '}
							<span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-blue-600">
								powerful
							</span>{' '}
							AI systems.
						</h1>
					</div>

					<Chat />
				</div>
			</div>
			<TrustedBy />
		</Section>
	)
}

export default function Page() {
	return (
		<div className="flex flex-col items-center">
			<Hero />
			<Section className="space-y-40">
				<Testimonials />
				<Partners />
				<CTA />
				{/* <VimeoVideo /> */}
				<Video
					hlsUrl="https://d2os0zhpsj02b0.cloudfront.net/hero/hls/master.m3u8"
					mp4Url="https://d2os0zhpsj02b0.cloudfront.net/hero/preview.mp4"
					posterUrl="/images/video-thumbnail.jpg"
					transcriptionUrl="/transcripts/hero.vtt"
				/>
			</Section>
			<Footer />
		</div>
	)
}
