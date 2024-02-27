import {ArrowUpRightIcon} from 'lucide-react'
import Image, {type StaticImageData} from 'next/image'
import {ReactElement} from 'react'
import Button from './Button'

type IProps = {
	title: ReactElement
	description: string
	videoSrc?: string
	website?: string
	imageSrc: StaticImageData
	imageAlt?: string
}

export default function LabProject({
	title,
	description,
	videoSrc,
	website,
	imageSrc,
	imageAlt = 'Cover photo for project'
}: IProps) {
	return (
		<section className='relative flex h-screen w-screen items-center justify-center p-5 sm:p-0'>
			<div className='from-primary to-primary absolute h-full w-full bg-gradient-to-b via-transparent opacity-30' />
			<div className='z-10 flex w-full max-w-lg flex-col items-center gap-4 text-center text-xl'>
				<div className='flex flex-col items-center'>
					{title}
					<p className='font-thin'>{description}</p>
				</div>
				<div className='flex w-full flex-col items-center gap-2 sm:flex-row'>
					{videoSrc && (
						<Button
							variant='outline'
							body='Watch video'
							href={videoSrc}
							icon={
								<ArrowUpRightIcon className='font-neue-bit opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100' />
							}
						/>
					)}
					{website && (
						<Button
							variant='dark'
							body='Try it out'
							href={website}
						/>
					)}
				</div>
			</div>
			<Image
				src={imageSrc}
				alt={imageAlt}
				className='absolute -z-10 h-full w-full object-cover opacity-50'
			/>
		</section>
	)
}
