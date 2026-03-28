'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContext = {
	setTheme: (theme: Theme) => void
	theme: Theme
	resolved: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContext>({
	setTheme: () => {},
	theme: 'system',
	resolved: 'dark'
})

export function useTheme() {
	return useContext(ThemeContext)
}

function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'dark'
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('system')
	const [resolved, setResolved] = useState<'light' | 'dark'>('dark')

	const applyTheme = useCallback((t: Theme) => {
		const r = t === 'system' ? getSystemTheme() : t
		setResolved(r)
		document.documentElement.setAttribute('data-theme', r)
	}, [])

	const setTheme = useCallback(
		(t: Theme) => {
			setThemeState(t)
			localStorage.setItem('theme', t)
			applyTheme(t)
		},
		[applyTheme]
	)

	useEffect(() => {
		const stored = localStorage.getItem('theme') as Theme | null
		const initial = stored || 'system'
		setThemeState(initial)
		applyTheme(initial)
	}, [applyTheme])

	useEffect(() => {
		if (theme !== 'system') return
		const mq = window.matchMedia('(prefers-color-scheme: light)')
		const handler = () => applyTheme('system')
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [theme, applyTheme])

	return (
		<ThemeContext.Provider value={{ setTheme, theme, resolved }}>
			{children}
		</ThemeContext.Provider>
	)
}
