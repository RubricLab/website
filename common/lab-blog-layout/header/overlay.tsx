'use client'

import {useAppStore} from '@/context/use-app-store'

export const MenuOverlay = () => {
  const [menuOpen, setMenuOpen] = useAppStore(s => [s.menuOpen, s.setMenuOpen])

  return (
    <div
      onClick={() => {
        setMenuOpen(false)
      }}
      className={`transition-in-out z-overlay bg-soul/10 fixed inset-0 transition-opacity md:hidden
        ${menuOpen ? 'pointer-events-all cursor-pointer opacity-100' : 'pointer-events-none opacity-0'}
    `}
    />
  )
}
