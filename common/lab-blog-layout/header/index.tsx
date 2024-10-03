'use client'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import LabLogo from './lab-logo'
import { MobileMenu, MobileMenuToggle } from './mobile-menu'
import { MenuOverlay } from './overlay'

export const navLinks = [
	{
		title: 'Showcase',
		href: '/lab'
	},
	{
		title: 'Blog',
		href: '/blog'
	}
]

export const socialLinks = [
	{
		title: 'GitHub',
		href: 'https://github.com/RubricLab'
	},
	{
		title: 'Follow on X',
		href: 'https://x.com/RubricLabs'
	},
	{
		title: 'LinkedIn',
		href: 'https://linkedin.com/company/RubricLabs'
	}
]

const Header = () => {
	const pathname = usePathname()

	return (
		<>
			<header
				id="header"
				className="fixed top-0 right-0 left-0 z-header w-full border-border border-b bg-surface px-sides text-text"
			>
				<div className="grid h-header grid-cols-12">
					<div className="col-span-3 flex items-center border-border border-r border-l p-em-[12] md:items-end">
						<LabLogo className="h-em-[18] text-surface-contrast md:h-em-[24]" />
					</div>
					<div className="col-span-2 hidden border-border border-r md:block lg:col-span-4" />
					<span className="col-span-1 hidden h-full border-border border-r lg:block" />
					<>
						{navLinks.map((link, index) => (
							<HeaderLink
								isActive={pathname.startsWith(link.href)}
								className="col-span-2 hidden place-items-end md:grid lg:col-span-1"
								key={index}
								href={link.href}
							>
								{link.title}
							</HeaderLink>
						))}
						<HeaderLink className="col-span-3 hidden place-items-end md:grid lg:col-span-2" href="/">
							GO BACK TO RUBRIC
						</HeaderLink>
					</>
					<MobileMenuToggle />
				</div>
			</header>
			<MobileMenu />
			<MenuOverlay />
		</>
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
			className={`focus-ring border-border border-r p-em-[8] text-em-[16/16] transition-colors duration-300 ease-in-out ${isActive ? 'bg-surface-contrast/5 text-text-secondary' : 'text-text-primary hover:bg-surface-contrast/[0.02] hover:text-text-secondary'}${className}`}
			{...rest}
		>
			{children}
		</Link>
	)
}

export default Header
