import { Cal } from './logos/Cal'
import { GlassBlade } from './logos/GlassBlade'
import { Graphite } from './logos/Graphite'
import { Sligo } from './logos/Sligo'
import { Trigger } from './logos/Trigger'

const logos = [
	<Graphite className="w-60" key="graphite" />,
	<Cal className="w-36" key="cal" />,
	<Trigger className="w-60" key="trigger" />,
	<GlassBlade className="w-64" key="glassblade" />,
	<Sligo className="w-36" key="sligo" />
]

export const Logos = () => {
	return (
		<div className="w-screen overflow-x-hidden">
			<div className="relative h-56 w-[150vw] min-w-[1500px]">
				<div className="absolute left-0 flex animate-carousel">
					<div className="flex w-full flex-row items-center justify-around whitespace-nowrap pt-10 pb-28 text-neutral-500 sm:flex-row">
						{logos.map(Logo => Logo)}
					</div>
					<div className="flex w-full flex-row items-center justify-around whitespace-nowrap pt-10 pb-28 text-neutral-500 sm:flex-row">
						{logos.map(Logo => Logo)}
					</div>
				</div>
			</div>
		</div>
	)
}
