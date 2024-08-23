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
    <header className='fixed left-0 right-0 top-0 z-[999] w-full border-b border-border bg-surface px-sides text-text'>
      <div className='grid h-header grid-cols-12'>
        <div className='col-span-3 flex items-center border-l border-r border-border p-em-[12] md:items-end'>
          <LabLogo className='text-surface-contrast h-em-[18] md:h-em-[24]' />
        </div>
        <>
          {links.map((link, index) => (
            <HeaderLink
              isActive={pathname.startsWith(link.href)}
              className='hidden w-col-1 place-items-end md:grid'
              key={index}
              href={link.href}>
              {link.title}
            </HeaderLink>
          ))}
          <HeaderLink
            className='hidden w-col-2 place-items-end md:grid'
            href='/'>
            GO BACK TO RUBRIC
          </HeaderLink>
        </>
        <div className='col-span-5 hidden border-r border-border md:block' />
        <button className='col-[7/span_6] flex items-center justify-end border-l border-r border-border p-em-[12] md:hidden'></button>
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
      className={`focus-ring border-r border-border uppercase transition-[background-color_0.5s,box-shadow_0.25s] ease-in-out p-em-[8] text-em-[16/16]
        ${isActive ? 'bg-surface-contrast/5 text-text-secondary' : 'text-text-primary hover:bg-surface-contrast/[0.02] hover:text-text-secondary'}
        ${className}`}
      {...rest}>
      {children}
    </Link>
  )
}

export default Header
