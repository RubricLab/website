import { codeSnippetFragment } from '@/components/code-snippet'
import { FaqItemComponentFragment, richTextCalloutComponentFragment } from '@/components/rich-text'
import { fragmentOn } from 'basehub'
import { authorFragment, darkLightImageFragment } from '../fragments'

export const blogpostCardFragment = fragmentOn('BlogPostComponent', {
	_id: true,
	_title: true,
	_slug: true,
	description: true,
	publishedAt: true,
	authors: authorFragment,
	image: darkLightImageFragment,
	categories: true,
	body: {
		plainText: true,
		json: {
			__typename: true,
			blocks: {
				__typename: true,
				on_FaqItemComponent: FaqItemComponentFragment,
				on_RichTextCalloutComponent: richTextCalloutComponentFragment,
				on_CodeSnippetComponent: codeSnippetFragment
			},
			content: 1,
			toc: 1
		}
	}
})

export type BlogpostCardFragment = fragmentOn.infer<typeof blogpostCardFragment>

export type BlogPostCard = {
	type?: 'card' | 'list' | 'inline-card'
	className?: string
} & BlogpostCardFragment

export type BlogCategory = BlogpostCardFragment['categories'][0]

export const isCategory = (
	category: string,
	availableCategories: BlogCategory[]
): category is BlogCategory => {
	return availableCategories.includes(category as BlogCategory)
}
