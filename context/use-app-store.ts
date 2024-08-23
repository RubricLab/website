import {create} from 'zustand'

export interface AppStore {
  loaded: boolean
  setLoaded: (loaded: boolean) => void
  menuOpen: boolean
  setMenuOpen: (menuOpen: boolean) => void
  toggleMenuOpen: () => void
}

export const useAppStore = create<AppStore>(set => ({
  loaded: false,
  setLoaded: loaded => set({loaded}),
  menuOpen: false,
  setMenuOpen: menuOpen => set({menuOpen}),
  toggleMenuOpen: () => set(state => ({menuOpen: !state.menuOpen}))
}))
