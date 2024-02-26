'use client'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect} from 'react'
import Button from './Button'
import Title from './Title'

const shortcuts = [
	{href: '/about', key: 'a'},
	{href: '/lab', key: 'l'},
	{href: '/contact', key: 'r'},
	{href: '/blog', key: 'b'},
	{href: '/projects', key: 'p'},
	{href: '/newsletter', key: 'n'},
	{href: '/', key: 'h'},
	{href: '/', key: 'escape'}
]

export default function NavBar() {
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		// Ignore event handlers on the studio route
		if (pathname.startsWith('/studio')) return

		// Get started with keyboard navigation
		const handleKeyboardEvent = (event: KeyboardEvent) => {
			// The target is an input or textarea, so exit the function and do nothing
			if (
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')
			)
				return

			shortcuts.map(shortcut => {
				if (shortcut.key == event.key.toLowerCase()) router.push(shortcut.href)
			})
		}

		// Add event listener
		window.addEventListener('keydown', handleKeyboardEvent)

		// Clean up event listener
		return () => window.removeEventListener('keydown', handleKeyboardEvent)
	}, [router, pathname])

	if (pathname.startsWith('/studio')) return <></>

	return (
		<nav className='absolute left-[50%] top-0 z-40 flex w-full -translate-x-1/2 items-center justify-between gap-1 p-5 sm:px-10'>
			<Link
				className='text-inherit no-underline'
				href='/'>
				<Title size='small' />
			</Link>
			<div className='flex items-center gap-4'>
				{pathname !== '/about' && (
					<Link
						className='hidden no-underline underline-offset-4 transition-all duration-300 hover:underline sm:flex'
						href='/about'>
						About
					</Link>
				)}
				{pathname !== '/contact' && (
					<Button
						body='Get in touch'
						className='w-fit'
						href='/contact'
						variant='dark'
					/>
				)}
			</div>
		</nav>
	)
}
