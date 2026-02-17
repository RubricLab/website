import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { createSlugger } from './lib/utils/slugger'
import { CodeBlock } from './ui/codeblock'
import { CopiableHeading } from './ui/copiable-heading'
import { CustomImage } from './ui/custom-image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	const slugger = createSlugger()

	const isExternalHref = (href: string) => href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

	const getText = (node: ReactNode): string => {
		if (node == null || typeof node === 'boolean') return ''
		if (typeof node === 'string' || typeof node === 'number') return String(node)
		if (Array.isArray(node)) return node.map(getText).join('')
		if (typeof node === 'object' && 'props' in node) {
			const element = node as { props?: { children?: ReactNode } }
			return getText(element.props?.children)
		}
		return ''
	}

	return {
		...components,
		a: ({ children, className, href, rel, ...props }: ComponentPropsWithoutRef<'a'>) => {
			if (!href || typeof href !== 'string') return <a href={href} {...props} />
			if (href.startsWith('#')) return <a href={href} {...props} />
			if (href.startsWith('/')) return <Link href={href} className={className}>{children}</Link>
			if (isExternalHref(href)) {
				const safeRel = rel ? `${rel} noopener noreferrer` : 'noopener noreferrer'
				return (
					<a href={href} className={className} rel={safeRel} target="_blank" {...props}>
						{children}
					</a>
				)
			}
			return (
				<a href={href} className={className} rel={rel} {...props}>
					{children}
				</a>
			)
		},
		h1: props => (
			<CopiableHeading as="h1" id={props.id ?? slugger.slug(getText(props.children))} {...props} />
		),
		h2: props => (
			<CopiableHeading as="h2" id={props.id ?? slugger.slug(getText(props.children))} {...props} />
		),
		h3: props => (
			<CopiableHeading as="h3" id={props.id ?? slugger.slug(getText(props.children))} {...props} />
		),
		img: CustomImage,
		pre: CodeBlock
	}
}
