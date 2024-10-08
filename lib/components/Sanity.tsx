import type { PortableTextReactComponents } from '@portabletext/react'
import urlBuilder from '@sanity/image-url'
import Image from 'next/image'
import { sanity } from '~/sanity/utils'

export const SanityComponents: Partial<PortableTextReactComponents> = {
	types: {
		image: ({ value }) => (
			<div>
				<Image
					src={urlBuilder(sanity).image(value).url()}
					alt={value.alt || ' '}
					loading="lazy"
					width={0}
					height={0}
					sizes="100vw"
					className="my-4 h-auto w-full rounded-md"
				/>
			</div>
		)
	},
	marks: {},
	block: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		blockquote: ({ children }: { children?: any }) => (
			<blockquote className="border-secondary border-l pl-4 text-secondary">{children}</blockquote>
		),
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		normal: ({ children }: { children?: any }) => <p className="text-red leading-7">{children}</p>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		h1: ({ children }: { children?: any }) => <h1 className="mt-8 leading-10">{children}</h1>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		h2: ({ children }: { children?: any }) => (
			<h2 className="mt-6 font-medium leading-8">{children}</h2>
		),
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		h3: ({ children }: { children?: any }) => <h3 className="mt-4 font-medium">{children}</h3>
	},
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		number: ({ children }) => <li>{children}</li>
	}
}
