import Image from 'next/image'
import hero from '~/app/images/hero.png'
import cool from '~/app/images/cool.jpeg'
import warm from '~/app/images/warm.jpeg'
import { Button } from '~/ui/button'
import { TriangleRight } from '~/ui/icons/triangle-right'
import { Cal } from '~/ui/logos/cal'
import { Gumloop } from '~/ui/logos/gumloop'

export default async function Page() {
	return (
		<div className="flex h-screen items-center gap-16 overflow-x-scroll">
			<div className="flex h-full w-full shrink-0 flex-col items-center">
				<div className="flex h-full w-full max-w-5xl flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={hero} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Button className="absolute right-8 bottom-8">
							Play video
							<TriangleRight className="w-3" />
						</Button>
					</div>
					<p className="max-w-1/2 text-lg">
						We&apos;re an applied AI Lab helping companies deploy intelligence at scale, building the next
						generation of personalized software, enabled by AI.
					</p>
				</div>
			</div>
			<div className="flex h-full w-full shrink-0 flex-col items-center">
				<div className="flex h-full w-full max-w-5xl flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={cool} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Cal className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32" />
					</div>
					<div className="flex justify-between gap-8">
						<h2>Cal.ai</h2>
						<div className="flex w-1/2 flex-col gap-4">
							<p>
								A system to manage your calendar with words. How one of the first agentic products to market
								started.
							</p>
							<Button>View project</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full shrink-0 flex-col items-center">
				<div className="flex h-full w-full max-w-5xl flex-col justify-center space-y-8">
					<div className="relative h-full max-h-[560px] w-full overflow-hidden">
						<Image fill className="object-cover" src={warm} alt="Rubric Labs" />
						<div className="absolute top-0 left-0 h-full w-full backdrop-grayscale transition-all duration-300 hover:opacity-0" />
						<Gumloop className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-32" />
					</div>
					<div className="flex justify-between gap-8">
						<h2>Gumloop</h2>
						<div className="flex w-1/2 flex-col gap-4">
							<p>
								A UI system built to scale to infinite AI workflows. How we worked with Gumloop to capture
								the imagination of a new class of builder.
							</p>
							<Button>View project</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
