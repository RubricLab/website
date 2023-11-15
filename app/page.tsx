import Hero from '../lib/components/Hero'
import Letter from '../lib/components/Letter'
import Projects from '../lib/components/Projects'
import getMetadata from '../utils/getMetadata'

export const metadata = getMetadata({title: 'Home'})

export default async function Home() {
	return (
		<div className='flex flex-col'>
			<Hero />
			<Projects />
			<Letter />
		</div>
	)
}
