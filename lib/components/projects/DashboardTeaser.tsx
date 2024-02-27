import Image from 'next/image'
import tron from '~/assets/tron.png'

export default function DashboardTeaser() {
	return (
		<section className='relative flex h-screen w-screen items-center justify-center'>
			<div className='from-primary to-primary absolute h-full w-full bg-gradient-to-b via-transparent opacity-30' />
			<div className='z-10 flex flex-col items-center gap-2 text-center text-xl'>
				<span className='font-mono text-2xl'>dashboard</span>
				<p className='font-thin'>coming soon.</p>
			</div>
			<Image
				src={tron}
				alt='Futuristic scene'
				className='absolute -z-10 h-full w-full object-cover opacity-50'
			/>
		</section>
	)
}
