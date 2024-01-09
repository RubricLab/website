import {Metadata} from 'next'
import Hero from '~/components/AgencyHero'
import FAQs from '~/components/FAQs'
import HowWeWork from '~/components/HowWeWork'
import Projects from '~/components/Projects'
import Testimonials from '~/components/Testimonials'
import {DEFAULT_META, META} from '~/constants/metadata'

export const metadata: Metadata = {
	...DEFAULT_META,
	openGraph: {
		...DEFAULT_META.openGraph,
		title: `Agency | ${META.title}`
	},
	title: `Agency | ${META.title}`,
	twitter: {
		...DEFAULT_META.twitter,
		title: `Agency | ${META.title}`
	}
}

export default function Agency() {
	return (
		<div className='flex flex-col'>
			<Hero />
			<Projects />
			<HowWeWork />
			<Testimonials />
			<FAQs />
		</div>
	)
}
