import Link, {LinkProps} from 'next/link'
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
	return (
		<header className='text-text dark:text-dark-text px-sides bg-surface border-border fixed left-0 right-0 top-0 z-[999] w-full border-b'>
			<div className='h-header grid grid-cols-12'>
				<div className='border-border col-span-3 flex items-end border-l border-r p-2'>
					<LabLogo className='text-surface' />
				</div>
				{links.map((link, index) => (
					<HeaderLink
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
			className={`border-border hover:bg-surface-contrast/[0.02] hover:text-text-secondary
                border-r p-2 uppercase
                        ${isActive ? 'text-text-secondary bg-surface/5' : 'text-text-primary'}
                        ${className}`}
			{...rest}>
			{children}
		</Link>
	)
}

export default Header
