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
				<div className="flex flex-wrap items-center justify-center gap-10 border-border/50 border-t py-12 md:gap-16 md:py-16">
					{logos.map(logo => (
						<div
							key={logo.name}
							className="flex items-center opacity-30 transition-opacity duration-300 hover:opacity-60"
						>
							<logo.Component className="h-[22px] w-auto fill-white text-white" />
						</div>
					))}
				</div>
			</div>
		</FadeIn>
	)
}
