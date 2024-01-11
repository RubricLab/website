import Hero from '~/components/LandingHero'
import Letter from '~/components/Letter'
import Projects from '~/components/Projects'
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
			<Letter />
		</div>
	)
}
