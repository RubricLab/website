import {ContactButton, Header} from '@rubriclab/ui'
import {Metadata} from 'next'
import {DEFAULT_META} from '../constants/metadata'

export const metadata: Metadata = {
	...DEFAULT_META
}

export default async function Home() {
	return (
		<div className='flex flex-col'>
			{/* Section: Hero */}
			<div className='flex min-h-screen max-w-3xl flex-col justify-end gap-3 pb-5'>
				<Header text={'Welcome to my new Rubric app'} />
				<p className='text-3xl font-extralight sm:text-6xl md:text-6xl'>
					This project was bootstrapped with <a href='https://www.npmjs.com/package/create-rubric-app'>create-rubric-app</a>
				</p>
			</div>

			{/* Section */}
			<div className='flex min-h-screen flex-col items-end justify-end gap-3 pb-5'>
				<div className='flex max-w-xl flex-col gap-10'>
					<div className='flex justify-end'>
						<ContactButton body='hello@rubriclab.com' />
					</div>
				</div>
			</div>
		</div>
	)
}
