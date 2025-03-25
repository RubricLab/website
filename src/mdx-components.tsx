import type { MDXComponents } from 'mdx/types'
import { CaptionedImage } from './ui/captioned-image'
import { CodeBlock } from './ui/codeblock'
import { CopiableHeading } from './ui/copiable-heading'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		pre: CodeBlock,
		img: CaptionedImage,
		h1: props => <CopiableHeading as="h1" {...props} />,
		h2: props => <CopiableHeading as="h2" {...props} />,
		h3: props => <CopiableHeading as="h3" {...props} />
	}
}
