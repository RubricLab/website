import AboutHero from '~/components/AboutHero'
import Letter from '~/components/Letter'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'About',
	description:
		"Hello world! We're Rubric. A nomadic team of engineers and artists working on the next generation of technology. \n \n We have been tinkering, hacking, breaking and building for over a decade and could not be more excited and optimistic about the future.",
	path: 'about'
})

export default function About() {
	return (
		<div className="flex flex-col">
			<AboutHero />
			<Letter />
		</div>
	)
}
