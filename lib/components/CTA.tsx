import Button from './Button'

export const CTA = () => {
	return (
		<section
			id='cta'
			className='flex min-h-screen w-screen flex-col items-center justify-center gap-10 bg-neutral-100 p-8 text-center dark:bg-neutral-950'>
			<h1 className='text-secondary max-w-2xl italic leading-[3.5rem]'>
				the people who are crazy enough to think they can change the world are the
				ones who do
			</h1>
			<h4>Now accepting projects for 2Q24.</h4>
			<Button
				body='Get in touch'
				className='w-fit'
				href='/contact'
				variant='dark'
			/>
		</section>
	)
}
