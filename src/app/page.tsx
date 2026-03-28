import { CTA } from '~/components/cta'
import { FeaturedWork } from '~/components/featured-work'
import { Hero } from '~/components/hero'
import { LabPreview } from '~/components/lab-preview'
import { LogoBar } from '~/components/logo-bar'
import { Pillars } from '~/components/pillars'
import { VideoSection } from '~/components/video-section'

export default function Home() {
	return (
		<>
			<Hero />
			<LogoBar />
			<Pillars />
			<FeaturedWork />
			<LabPreview />
			<VideoSection />
			<CTA />
		</>
	)
}
