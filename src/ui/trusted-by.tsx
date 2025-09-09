'use client'

import Link from 'next/link'
import { Albertsons } from './logos/albertsons'
import { Cal } from './logos/cal'
import { Graphite } from './logos/graphite'
import { Gumloop } from './logos/gumloop'

export const TrustedBy = () => {
	const items = [
		{ href: '/work#Gumloop', Logo: Gumloop, widthClass: 'w-36' },
		{ href: '/work#Graphite', Logo: Graphite, widthClass: 'w-40' },
		{ href: '/work#Albertsons', Logo: Albertsons, widthClass: 'w-48' },
		{ href: '/work#Cal', Logo: Cal, widthClass: 'w-32' }
	]

	return (
		<div
			className="group relative w-full max-w-2xl space-y-4 overflow-hidden"
			style={{
				maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
				WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
			}}
		>
			<p className="text-center text-secondary text-sm">Trusted by world-class companies</p>
			<div className="marquee flex w-max items-center gap-12">
				{items.map(({ href, Logo, widthClass }, idx) => (
					<Link key={`logo-a-${idx}`} className={widthClass} href={href}>
						<Logo className="w-full" />
					</Link>
				))}
				{items.map(({ href, Logo, widthClass }, idx) => (
					<Link key={`logo-b-${idx}`} className={widthClass} href={href} aria-hidden="true">
						<Logo className="w-full" />
					</Link>
				))}
			</div>
			<style jsx global>{`
				@keyframes marquee {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				.marquee {
					animation: marquee 25s linear infinite;
					will-change: transform;
				}
				.group:hover .marquee {
					animation-play-state: paused;
				}
			`}</style>
		</div>
	)
}
