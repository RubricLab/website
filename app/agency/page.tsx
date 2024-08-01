import CallToAction from '~/components/landing/CallToAction'
import FAQs from '~/components/landing/FAQs'
import HowWeWork from '~/components/landing/HowWeWork'
import LandingHero from '~/components/landing/LandingHero'
import Projects from '~/components/landing/Projects'
import Testimonials from '~/components/landing/Testimonials'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Agency',
	description:
		'We are an applied AI lab working with companies to build the future users want with magical software.',
	path: 'agency'
})

export default function Agency() {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<Projects />
			<HowWeWork />
			<Testimonials />
			<FAQs />
			<CallToAction />
		</div>
	)
}
