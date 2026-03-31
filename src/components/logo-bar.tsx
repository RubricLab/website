'use client'

import { Albertsons } from '~/components/logos/albertsons'
import { Cal } from '~/components/logos/cal'
import { Graphite } from '~/components/logos/graphite'
import { Greptile } from '~/components/logos/greptile'
import { Gumloop } from '~/components/logos/gumloop'
import { Langchain } from '~/components/logos/langchain'
import { Trigger } from '~/components/logos/trigger'
import { Vercel } from '~/components/logos/vercel'

// Widths tuned per-logo so they feel visually balanced
const logos = [
	{ Component: Vercel, name: 'Vercel', w: 'w-[72px]' },
	{ Component: Langchain, name: 'LangChain', w: 'w-[90px]' },
	{ Component: Albertsons, name: 'Safeway', w: 'w-[88px]' },
	{ Component: Gumloop, name: 'Gumloop', w: 'w-[64px]' },
	{ Component: Cal, name: 'Cal.com', w: 'w-[68px]' },
	{ Component: Graphite, name: 'Graphite', w: 'w-[76px]' },
	{ Component: Trigger, name: 'Trigger.dev', w: 'w-[72px]' },
	{ Component: Greptile, name: 'Greptile', w: 'w-[60px]' },
]

export function LogoBar({ compact = false }: { compact?: boolean }) {
	if (compact) {
		// Seamless scrolling marquee — two copies side by side
		return (
			<div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
				<div className="flex items-center gap-12 w-max animate-[scroll-logos_30s_linear_infinite]">
					{[...logos, ...logos].map((logo, i) => (
						<div key={`${logo.name}-${i}`} className="flex items-center shrink-0 opacity-30">
							<logo.Component className={`h-auto text-primary ${logo.w}`} />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="border-y border-subtle py-6">
			<div className="mx-auto max-w-[1200px] px-6 md:px-8">
				<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
					{logos.map(logo => (
						<div key={logo.name} className="flex items-center opacity-40 hover:opacity-70 transition-opacity duration-200">
							<logo.Component className={`h-auto text-primary ${logo.w}`} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
