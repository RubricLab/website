import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {create} from 'zustand'

interface PreviewStore {
  selectedPost: BlogPostCard
  setSelectedPost: (post: BlogPostCard | null) => void
  clearSelectedPost: () => void
}

export const usePreviewStore = create<PreviewStore>(set => ({
  selectedPost: null,
  setSelectedPost: post => set({selectedPost: post}),
  clearSelectedPost: () => set({selectedPost: null})
}))
