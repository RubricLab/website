import Hero from '~/components/AgencyHero'
import {CTA} from '~/components/CTA'
import FAQs from '~/components/FAQs'
import HowWeWork from '~/components/HowWeWork'
import Projects from '~/components/Projects'
import Testimonials from '~/components/Testimonials'
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
			<Hero />
			<Projects />
			<HowWeWork />
			<Testimonials />
			<FAQs />
			<CTA />
		</div>
	)
}
