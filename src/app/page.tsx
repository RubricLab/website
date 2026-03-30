import { CTA } from '~/components/cta'
import { FeaturedWork } from '~/components/featured-work'
import { HeroEngine } from '~/components/hero/index'
import { LabPreview } from '~/components/lab-preview'
import { Process } from '~/components/process'
import { VideoSection } from '~/components/video-section'

export default function Home() {
	return (
		<>
			{/* Hero + scroll-driven engine reveal (includes logos) */}
			<HeroEngine />

			<Process />
			<FeaturedWork />
			<LabPreview />
			<VideoSection />
			<CTA />
		</>
	)
}
