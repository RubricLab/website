import Button from '../Button'
import SectionLayout from './SectionLayout'

const CallToAction = () => {
	return (
		<SectionLayout
			id='cta'
			isAlternate>
			<h1 className='text-secondary max-w-2xl italic leading-[3.5rem]'>
				those who are crazy enough to think they can change the world are the ones
				who do
			</h1>
			<Button
				body='Get in touch'
				className='w-fit'
				href='/contact'
				variant='dark'
			/>
		</SectionLayout>
	)
}

export default CallToAction
