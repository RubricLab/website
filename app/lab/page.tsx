import LabHero from '~/components/hero/LabHero'
import DashboardTeaser from '~/components/projects/DashboardTeaser'
import MaigeTeaser from '~/components/projects/MaigeTeaser'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Lab',
	description:
		'We make AI-enabled magical software. Rubric is a digital studio specializing in LangChain, Next.js, and AI-enabled product development.',
	path: 'lab'
})

export default function Lab() {
	return (
		<>
			<LabHero />
			<MaigeTeaser />
			<DashboardTeaser />
		</>
	)
}
