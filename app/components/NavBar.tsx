'use client'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import Button from './Button'
import Title from './Title'

export default function NavBar() {
	const router = useRouter()

	useEffect(() => {
		// Get started with R
		const handleKeyboardEvent = (event: KeyboardEvent) => {
			if (['r', 'R'].includes(event.key)) router.push('/contact')
			if (['b', 'B'].includes(event.key)) router.push('/blog')
			if (['p', 'P'].includes(event.key)) router.push('/projects')
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
