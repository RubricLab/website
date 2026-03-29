import { CTA } from '~/components/cta'
import { FeaturedWork } from '~/components/featured-work'
import { HeroEngine } from '~/components/hero/index'
import { LabPreview } from '~/components/lab-preview'
import { LogoBar } from '~/components/logo-bar'
import { Process } from '~/components/process'
import { VideoSection } from '~/components/video-section'

export default function Home() {
	return (
		<>
			{/* Hero + scroll-driven engine reveal */}
			<HeroEngine />

			{/* Tagline */}
			<div className="py-16 text-center">
				<p className="font-mono text-sm text-[#555555] tracking-widest">
					A lab that ships.
				</p>
			</div>

			<LogoBar />
			<Process />
			<FeaturedWork />
			<LabPreview />
			<VideoSection />
			<CTA />
		</>
	)
}
