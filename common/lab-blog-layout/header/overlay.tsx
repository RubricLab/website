'use client'

import { useAppStore } from '@/context/use-app-store'

export const MenuOverlay = () => {
	const [menuOpen, setMenuOpen] = useAppStore(s => [s.menuOpen, s.setMenuOpen])

	return (
		<div
			onClick={() => setMenuOpen(false)}
			onKeyDown={e => e.key === 'Enter' && setMenuOpen(false)}
			role="button"
			tabIndex={0}
			className={`fixed inset-0 z-overlay bg-soul/10 bg-surface/80 backdrop-blur-[2px] transition-[opacity,backdrop-filter] transition-in-out duration-300 md:hidden ${menuOpen ? 'pointer-events-all cursor-pointer opacity-100' : 'pointer-events-none opacity-0'}`}
		/>
	)
}
