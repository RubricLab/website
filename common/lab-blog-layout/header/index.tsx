'use client'
import Link, {LinkProps} from 'next/link'
import {usePathname} from 'next/navigation'
import LabLogo from './lab-logo'

const links = [
	{
		title: 'Showcase',
		href: '/lab'
	},
	{
		title: 'Blog',
		href: '/blog'
	}
]

const Header = () => {
	const pathname = usePathname()

	return (
		<header className='text-text dark:text-dark-text px-sides bg-surface border-border fixed left-0 right-0 top-0 z-[999] w-full border-b'>
			<div className='h-header grid grid-cols-12'>
				<div className='border-border col-span-3 flex items-end border-l border-r p-2'>
					<LabLogo className='text-surface-contrast h-em-[24]' />
				</div>
				{links.map((link, index) => (
					<HeaderLink
						isActive={pathname.startsWith(link.href)}
						className='col-span-1 grid place-items-end'
						key={index}
						href={link.href}>
						{link.title}
					</HeaderLink>
				))}
				<HeaderLink
					className='col-span-2 grid place-items-end'
					href='/'>
					GO BACK TO RUBRIC
				</HeaderLink>
				<div className='border-border col-span-5 border-r' />
			</div>
		</header>
	)
}

const HeaderLink = ({
	href,
	children,
	className,
	isActive,
	...rest
}: LinkProps & {
	children: React.ReactNode
	className?: string
	isActive?: boolean
}) => {
	return (
		<Link
			href={href}
			className={`border-border text-em-[20/16] p-em-[8] border-r uppercase transition-colors duration-500 ease-in-out
                        ${isActive ? 'text-text-secondary bg-surface-contrast/5' : 'text-text-primary hover:bg-surface-contrast/[0.02] hover:text-text-secondary'}
                        ${className}`}
			{...rest}>
			{children}
		</Link>
	)
}

export default Header
