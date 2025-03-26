import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from './ui/codeblock'
import { CopiableHeading } from './ui/copiable-heading'
import { CustomImage } from './ui/custom-image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		pre: CodeBlock,
		img: CustomImage,
		h1: props => <CopiableHeading as="h1" {...props} />,
		h2: props => <CopiableHeading as="h2" {...props} />,
		h3: props => <CopiableHeading as="h3" {...props} />
	}
}
