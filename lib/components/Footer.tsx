'use client'
import Link from 'next/link'
import Button from './Button'
import Title from './Title'

const items = [
	{title: 'Blog', href: '/blog'},
	{title: 'Contact', href: '/contact'},
	{title: 'Partners', href: '/partners'},
	{title: 'Projects', href: '/projects'},
	{title: 'Newsletter', href: '/newsletter'},
	{title: 'Brand', href: '/brand'}
]

const Footer = () => {
	return (
		<div className='fixed bottom-0 z-10 flex h-96 w-screen flex-col-reverse items-center justify-between gap-10 bg-black px-5 py-16 text-white dark:bg-white dark:text-black sm:flex-row sm:items-center sm:gap-0 sm:px-10 sm:py-20'>
			<div className='flex flex-col items-center gap-5 sm:items-start'>
				<Link
					href='/'
					className='no-underline'>
					<Title
						invert
						size='full'
					/>
				</Link>
				<div className='flex flex-col gap-1'>
					<p className='font-2xl text-negative'>
						{' '}
						Let&apos;s make something amazing, together.
					</p>
				</div>
				<Button
					body='Get in touch'
					variant='dark'
					href='/contact'
					className='mt-2 w-full max-w-sm'
				/>
			</div>

			<div className='flex w-full flex-row flex-wrap items-end justify-center gap-10 sm:w-auto sm:flex-col sm:gap-3'>
				{items
					.sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
					.map(item => (
						<Link
							key={item.title}
							className='no-underline underline-offset-4 transition-all duration-300 hover:underline'
							href={item.href}>
							{item.title}
						</Link>
					))}
			</div>
		</div>
	)
}

export default Footer
