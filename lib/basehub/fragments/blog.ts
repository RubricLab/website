import {fragmentOn} from 'basehub'
import {authorFragment, darkLightImageFragment} from '../fragments'

export const blogpostCardFragment = fragmentOn('BlogPostComponent', {
  _id: true,
  _title: true,
  _slug: true,
  description: true,
  publishedAt: true,
  authors: authorFragment,
  image: darkLightImageFragment,
  categories: true
})

export const blogpostPreviewFragment = fragmentOn('BlogPostComponent', {
  _id: true,
  _title: true,
  _slug: true,
  description: true,
  publishedAt: true,
  authors: authorFragment,
  image: darkLightImageFragment,
  categories: true,
  body: {
    markdown: true
  }
})

export type BlogpostCardFragment = fragmentOn.infer<typeof blogpostCardFragment>

export type BlogpostPreviewFragment = fragmentOn.infer<typeof blogpostPreviewFragment>

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
