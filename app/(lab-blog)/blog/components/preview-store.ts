import type { BlogPostCard } from '@/lib/basehub/fragments/blog'
import { create } from 'zustand'

interface PreviewStore {
	selectedPost: BlogPostCard
	setSelectedPost: (post: BlogPostCard | null) => void
	clearSelectedPost: (post: BlogPostCard) => void
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	selectedPost: null as any,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	setSelectedPost: post => set({ selectedPost: post as any }),
	clearSelectedPost: post => {
		const currentSelectedPost = get().selectedPost
		if (currentSelectedPost && post && currentSelectedPost._id === post._id)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			set({ selectedPost: null as any })
	}
}))
