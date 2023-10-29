'use client'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect} from 'react'
import Button from './Button'
import Title from './Title'

const shortcuts = [
	{keys: ['r', 'R'], href: '/contact'},
	{keys: ['b', 'B'], href: '/blog'},
	{keys: ['p', 'P'], href: '/projects'},
	{keys: ['n', 'N'], href: '/newsletter'}
]

export default function NavBar() {
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		// Ignore event handlers on the studio route
		if (pathname === '/studio') return

		// Get started with keyboard navigation
		const handleKeyboardEvent = (event: KeyboardEvent) => {
			shortcuts.map(shortcut => {
				if (shortcut.keys.includes(event.key)) router.push(shortcut.href)
			})
		}

		// Add event listener
		window.addEventListener('keydown', handleKeyboardEvent)

		// Clean up event listener
		return () => window.removeEventListener('keydown', handleKeyboardEvent)
	}, [router])

	return (
		<nav className='absolute left-[50%] top-0 z-20 flex w-full -translate-x-1/2 items-center justify-between gap-1 p-5 sm:px-10'>
			<Link
				href='/'
				className='text-inherit'>
				<Title size='small' />
			</Link>
			<Button
				body='Get in touch'
				variant='dark'
				href='/contact'
				className='w-fit'
			/>
		</nav>
	)
}
