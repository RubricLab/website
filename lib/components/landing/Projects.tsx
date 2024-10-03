import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Graphite } from '../logos/Graphite'
import { Gumloop } from '../logos/Gumloop'
import { Maige } from '../logos/Maige'
import SectionLayout from './SectionLayout'

const projects = [
	{
		desc:
			'Dashboard, component system, and landing page for Gumloop, the platform for automating any workflow with AI.',
		href: 'https://gumloop.com/',
		title: 'Gumloop',
		logo: <Gumloop key="gumloop" className="opacity-60" />
	},
	{
		desc: 'AI generated video of your code contributions.',
		href: 'https://year-in-code.com/',
		title: 'Year in Code',
		logo: <Graphite key="graphite" />
	},
	{
		desc: 'Open-source infrastructure for running natural language workflows on your codebase.',
		href: 'https://maige.app/',
		title: 'Maige',
		logo: (
			<Link
				href="https://maige.app"
				target="_blank"
				rel="noreferrer noopener"
				className="flex items-center gap-2 no-underline"
			>
				<Maige key="maige" className="w-8" />
				<span className="font-mono text-2xl">maige</span>
			</Link>
		)
	}
]

export default function Projects() {
	return (
		<SectionLayout id="projects" isAlternate>
			<div className="flex flex-col items-start sm:items-center">
				<h1>_featured projects</h1>
				<h3 className="text-secondary">We work with leading builders in the space.</h3>
			</div>
			<div className="grid gap-5 sm:grid-cols-2">
				{projects.map(({ title, desc, href, logo }) => (
					<div
						key={title}
						className="group col-span-1 flex h-[50vh] w-full flex-col gap-2 border border-secondary p-5 transition-colors hover:border-white sm:max-w-[50vh]"
					>
						<div className="font-semibold text-4xl">{title}</div>
						<p className="text-lg text-secondary leading-6">{desc}</p>
						<div className="grow" />
						<div className="flex w-full items-center justify-between">
							<div className="w-40 text-secondary text-opacity-60">{logo}</div>
							<Link
								className="group/link ml-auto flex gap-1 opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100"
								href={href}
							>
								<span>Learn more</span>
								<ArrowUpRight className="group-hover/link:-translate-y-1 w-4 transition-transform group-hover/link:translate-x-1" />
							</Link>
						</div>
					</div>
				))}
				<div className="flex w-full max-w-[50vh] items-end justify-end border border-secondary border-dashed p-5 sm:h-[50vh]">
					<Link href="/projects" className="group flex gap-2">
						<span>See all projects</span>
						<ArrowRight className="w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</SectionLayout>
	)
}
