import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from './ui/codeblock'
import { CaptionedImage } from './ui/captioned-image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		pre: CodeBlock,
		img: CaptionedImage
	}
}
