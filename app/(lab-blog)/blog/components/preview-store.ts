import { BlogPostCard } from '@/lib/basehub/fragments/blog'
import { create } from 'zustand'

interface PreviewStore {
  selectedPost: BlogPostCard
  setSelectedPost: (post: BlogPostCard | null) => void
  clearSelectedPost: (post: BlogPostCard) => void
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  selectedPost: null,
  setSelectedPost: post => set({ selectedPost: post }),
  clearSelectedPost: (post) => {
    if (get().selectedPost._id === post._id) {
      set({ selectedPost: null })
    }
  }
}))