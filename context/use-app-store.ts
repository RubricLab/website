import { isClient } from '@/lib/utils/constants'
import { create } from 'zustand'

export interface AppStore {
  debug: boolean
  loaded: boolean
  setLoaded: (loaded: boolean) => void
  menuOpen: boolean
  setMenuOpen: (menuOpen: boolean) => void
  toggleMenuOpen: () => void
}

const isDebug = () => {
  if (!isClient) return false

  const hasDebugHash = window.location.hash === '#debug'
  const hasDebugSearchParam = new URLSearchParams(window.location.search).has('debug')
  return hasDebugHash || hasDebugSearchParam
}

export const useAppStore = create<AppStore>(set => {
  return ({
    debug: isDebug(),
    loaded: false,
    setLoaded: loaded => set({ loaded }),
    menuOpen: false,
    setMenuOpen: menuOpen => set({ menuOpen }),
    toggleMenuOpen: () => set(state => ({ menuOpen: !state.menuOpen }))
  })
})
