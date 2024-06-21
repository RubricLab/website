import CallToAction from '~/components/landing/CallToAction'
import FAQs from '~/components/landing/FAQs'
import HowWeWork from '~/components/landing/HowWeWork'
import LandingHero from '~/components/landing/LandingHero'
import Projects from '~/components/landing/Projects'
import Testimonials from '~/components/landing/Testimonials'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Home',
	description:
		'We make AI-enabled magical software. Rubric is a digital studio specialized in LangChain, Next.js, and AI-enabled product development.',
	path: ''
})

export default async function Home() {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<HowWeWork />
			<Projects />
			<Testimonials />
			<FAQs />
			<CallToAction />
		</div>
	)
}
