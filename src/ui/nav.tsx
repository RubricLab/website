import { headers } from 'next/headers'
import Link from 'next/link'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Contact' }
]

export default async function Nav() {
	const headersList = await headers()
	const referer = headersList.get('referer')
	const url = new URL(referer || 'https://example.com')
	const { pathname } = url

	return (
		<nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between px-8 py-6">
			<Link href="/">Rubric Labs™</Link>
			<div className="flex items-center gap-4 text-sm">
				{links.map(link => (
					<Link
						href={link.href}
						key={link.href}
						className={cn({ 'opacity-50': pathname.includes(link.href) })}
					>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	)
}
