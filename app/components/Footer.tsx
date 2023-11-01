'use client'
import Link from 'next/link'
import Button from './Button'
import Title from './Title'

const items = [
	{title: 'Projects', href: '/projects'},
	{title: 'Blog', href: '/blog'},
	{title: 'Contact', href: '/contact'}
]

const Footer = () => {
	return (
		<div className='z-20 flex w-screen flex-col-reverse items-center justify-between gap-10 bg-black px-5 py-20 text-white dark:bg-white dark:text-black sm:flex-row sm:items-start sm:items-center sm:gap-0 sm:px-10'>
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
					<p className='font-2xl'> Let&apos;s make something amazing, together.</p>
				</div>
				<Button
					body='Get in touch'
					variant='dark'
					href='/contact'
					className='mt-2 w-fit'
				/>
			</div>

			<div className='flex w-full flex-row items-end justify-center gap-10 sm:w-auto sm:flex-col sm:gap-5'>
				{items.map(item => (
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
