import Button from './Button'

export const CTA = () => {
	return (
		<section
			id='cta'
			className='flex min-h-screen w-screen flex-col items-center justify-center gap-10 bg-neutral-100 p-8 text-center dark:bg-neutral-900'>
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
		</section>
	)
}
