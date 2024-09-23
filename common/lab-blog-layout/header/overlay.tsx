'use client'

import {useAppStore} from '@/context/use-app-store'

export const MenuOverlay = () => {
  const [menuOpen, setMenuOpen] = useAppStore(s => [s.menuOpen, s.setMenuOpen])

  return (
    <div
      onClick={() => {
        setMenuOpen(false)
      }}
      className={`transition-in-out z-overlay bg-soul/10 fixed inset-0 bg-surface/80 backdrop-blur-[2px] transition-[opacity,backdrop-filter] duration-300 md:hidden
        ${menuOpen ? 'pointer-events-all cursor-pointer opacity-100' : 'pointer-events-none opacity-0'}
    `}
    />
  )
}
