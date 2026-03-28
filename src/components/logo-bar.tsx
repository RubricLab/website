import { Albertsons } from '~/components/logos/albertsons'
import { Cal } from '~/components/logos/cal'
import { Graphite } from '~/components/logos/graphite'
import { Gumloop } from '~/components/logos/gumloop'
import { Langchain } from '~/components/logos/langchain'
import { Vercel } from '~/components/logos/vercel'
import { FadeIn } from './fade-in'

const logos = [
	{ Component: Vercel, name: 'Vercel' },
	{ Component: Langchain, name: 'LangChain' },
	{ Component: Albertsons, name: 'Safeway' },
	{ Component: Gumloop, name: 'Gumloop' },
	{ Component: Cal, name: 'Cal.com' },
	{ Component: Graphite, name: 'Graphite' }
]

export function LogoBar() {
	return (
		<FadeIn>
			<div className="mx-auto max-w-[1200px] px-6 md:px-10">
				<p className="mb-8 text-center font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
					Trusted by
				</p>
				<div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
					{logos.map(logo => (
						<div
							key={logo.name}
							className="flex items-center opacity-40 transition-opacity duration-300 hover:opacity-80"
						>
							<logo.Component className="h-5 w-auto max-w-[100px] text-text-primary" />
						</div>
					))}
				</div>
			</div>
		</FadeIn>
	)
}
