import { CTA } from '~/components/cta'
import { FeaturedWork } from '~/components/featured-work'
import { Hero } from '~/components/hero'
import { LogoBar } from '~/components/logo-bar'
import { Philosophy } from '~/components/philosophy'

export default function Home() {
	return (
		<>
			<Hero />
			<FeaturedWork />
			<Philosophy />
			<LogoBar />
			<CTA />
		</>
	)
}
