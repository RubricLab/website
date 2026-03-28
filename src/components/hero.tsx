import Link from 'next/link'
import { ContractTrace } from './contract-trace'
import { FadeIn } from './fade-in'

export function Hero() {
	return (
		<section className="relative flex min-h-svh flex-col justify-end pb-24 md:justify-center md:pb-0">
			<ContractTrace />
			<div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-10">
				<FadeIn>
					<h1 className="font-normal font-sans text-[clamp(40px,8vw,80px)] text-text-primary leading-[1.05] tracking-tight">
						A lab that ships.
					</h1>
				</FadeIn>
				<FadeIn delay={0.1}>
					<p className="mt-6 max-w-[520px] font-sans text-lg text-text-secondary leading-relaxed md:text-xl">
						We study how AI agents should be built — then we build them. For
						ourselves and for the companies that hire us.
					</p>
				</FadeIn>
				<FadeIn delay={0.2}>
					<Link
						href="/work"
						className="group mt-10 inline-flex items-center gap-2 font-mono text-[13px] text-text-tertiary transition-colors duration-200 hover:text-text-primary"
					>
						<span>See the work</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							&rarr;
						</span>
					</Link>
				</FadeIn>
			</div>
		</section>
	)
}
