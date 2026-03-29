import { Albertsons } from '~/components/logos/albertsons'
import { Cal } from '~/components/logos/cal'
import { Graphite } from '~/components/logos/graphite'
import { Gumloop } from '~/components/logos/gumloop'
import { Langchain } from '~/components/logos/langchain'
import { Vercel } from '~/components/logos/vercel'

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
		<div className="border-y border-[#1A1A1A] py-6">
			<div className="mx-auto max-w-[1200px] px-6 md:px-8">
				<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
					{logos.map(logo => (
						<div
							key={logo.name}
							className="flex items-center opacity-40 hover:opacity-70 transition-opacity duration-200"
						>
							<logo.Component className="h-[24px] w-auto text-white" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
