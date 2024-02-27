import Image from 'next/image'
import Link from 'next/link'
import desert from '~/assets/desert.png'
import {Maige} from '../logos/Maige'

export default function MaigeTeaser() {
	return (
		<section className='relative flex h-screen w-screen items-center justify-center'>
			<div className='from-primary to-primary absolute h-full w-full bg-gradient-to-b via-transparent opacity-30' />
			<div className='z-10 flex flex-col items-center gap-2 text-center text-xl'>
				<Link
					href='https://maige.app'
					target='_blank'
					rel='noreferrer noopener'
					className='flex items-center gap-2 no-underline'>
					<Maige
						key='maige'
						className='w-8'
					/>
					<span className='font-mono text-2xl'>maige</span>
				</Link>
				<p className='font-thin'>run natural language workflows on your codebase</p>
			</div>
			<Image
				src={desert}
				alt='Futuristic desert scene'
				className='absolute -z-10 h-full w-full object-cover opacity-50'
			/>
		</section>
	)
}
