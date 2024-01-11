import {PortableTextReactComponents} from '@portabletext/react'
import urlBuilder from '@sanity/image-url'
import Image from 'next/image'
import {sanity} from '~/sanity/utils'

const SanityComponents: Partial<PortableTextReactComponents> = {
	types: {
		image: ({value}) => (
			<div>
				<Image
					src={urlBuilder(sanity).image(value).url()}
					alt={value.alt || ' '}
					loading='lazy'
					width={0}
					height={0}
					sizes='100vw'
					className='my-4 h-auto w-full rounded-md'
				/>
			</div>
		)
	},
	block: {
		blockquote: ({children}: {children?: any}) => (
			<blockquote className='border-secondary text-secondary border-l pl-4'>
				{children}
			</blockquote>
		),
		normal: ({children}: {children?: any}) => (
			<p className='text-secondary leading-7'>{children}</p>
		)
	},
	listItem: {
		bullet: ({children}) => <li className='text-secondary'>{children}</li>
	}
}
export default SanityComponents
