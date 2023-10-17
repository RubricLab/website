import {getMetadata} from '../lib/utils'
import Hero from './components/Hero'
import Letter from './components/Letter'
import Projects from './components/Projects'

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
