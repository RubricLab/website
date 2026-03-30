import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
	CalAgentLoop,
	GumloopTimeline,
	SafewayMemory,
	SafewaySearchLoop,
	YicFlow
} from './components/case-study-diagrams'
import { CodeBlock } from './components/codeblock'
import { CopiableHeading } from './components/copiable-heading'
import { CustomImage } from './components/custom-image'
import { Figure, FigureCaption, FigureShare } from './components/figure'
import { createSlugger } from './lib/utils/slugger'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	const slugger = createSlugger()
	const figureComponents = Object.assign(Figure, { Caption: FigureCaption, Share: FigureShare })

	const isExternalHref = (href: string) =>
		href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

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
		CalAgentLoop,
		GumloopTimeline,
		SafewayMemory,
		SafewaySearchLoop,
		YicFlow,
		a: ({ children, className, href, rel, ...props }: ComponentPropsWithoutRef<'a'>) => {
			if (!href || typeof href !== 'string') return <a href={href} {...props} />
			if (href.startsWith('#')) return <a href={href} {...props} />
			if (href.startsWith('/'))
				return (
					<Link href={href} className={className}>
						{children}
					</Link>
				)
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
		Figure: figureComponents,
		'Figure.Caption': FigureCaption,
		'Figure.Share': FigureShare,
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
