import Link from 'next/link'

type CardProps = {
	href?: string
	children: React.ReactNode
	className?: string
}

export function Card({ href, children, className }: CardProps) {
	const styles = `group rounded-xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface ${className ?? ''}`

	if (href) {
		return (
			<Link href={href} className={styles}>
				{children}
			</Link>
		)
	}
	return <div className={styles}>{children}</div>
}
