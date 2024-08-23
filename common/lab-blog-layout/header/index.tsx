'use client'
import Link, {LinkProps} from 'next/link'
import {usePathname} from 'next/navigation'
import LabLogo from './lab-logo'
import {MobileMenu, MobileMenuToggle} from './mobile-menu'
import {MenuOverlay} from './overlay'

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
      <header className='z-header fixed left-0 right-0 top-0 w-full border-b border-border bg-surface px-sides text-text'>
        <div className='grid h-header grid-cols-12'>
          <div className='col-span-3 flex items-center border-l border-r border-border p-em-[12] md:items-end'>
            <LabLogo className='text-surface-contrast h-em-[18] md:h-em-[24]' />
          </div>
          <>
            {navLinks.map((link, index) => (
              <HeaderLink
                isActive={pathname.startsWith(link.href)}
                className='order-1 col-span-2 hidden place-items-end md:grid lg:-order-none lg:col-span-1'
                key={index}
                href={link.href}>
                {link.title}
              </HeaderLink>
            ))}
            <HeaderLink
              className='order-1 col-span-3 hidden place-items-end md:grid lg:-order-none lg:col-span-2'
              href='/'>
              GO BACK TO RUBRIC
            </HeaderLink>
          </>
          <div className='col-span-2 hidden border-r border-border md:block lg:col-span-5' />
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
      className={`focus-ring border-r border-border uppercase transition-[background-color_0.5s,box-shadow_0.25s] ease-in-out p-em-[8] text-em-[16/16]
        ${isActive ? 'bg-surface-contrast/5 text-text-secondary' : 'text-text-primary hover:bg-surface-contrast/[0.02] hover:text-text-secondary'}
        ${className}`}
      {...rest}>
      {children}
    </Link>
  )
}

export default Header
