import type { AuthorFragment } from '../basehub/fragments'

export function getAuthorName(author: AuthorFragment) {
	return author._title.split(' ')[0]
}
