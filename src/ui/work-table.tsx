'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TIMEOUT } from '~/lib/constants'
import { cn } from '~/lib/utils/cn'
import { Button } from './button'
import { CustomImage } from './custom-image'

type DemoLink = {
	href: string
	label: string
}

type Work = {
	name: string
	description: string
	date: string
	category: 'Client' | 'Internal'
	backgroundImageUrl?: string
	quote?: string
	image?: React.ReactNode
	link?: string | DemoLink
	secondaryLink?: string | DemoLink
}

const works = [
	{
		name: 'Archetype',
		description: 'We built a component system for Archetype.',
		date: '2023',
		category: 'Client',
		link: 'https://archetype.dev'
	},
	{
		name: 'SyncLinear',
		description:
			'We built a self-hostable app to sync GitHub issues to Linear. It serves 1k+ repos at no cost.',
		date: '2023',
		category: 'Client',
		link: 'https://synclinear.com'
	},
	{
		name: 'Weave',
		description: 'We built an enterprise-grade booking platform for Weave.',
		date: '2024',
		category: 'Client',
		link: 'https://weavein.co'
	},
	{
		name: 'Sweater Planet',
		description: 'We built a scalable eCommerce platform. Acquired.',
		date: '2022',
		category: 'Internal',
		link: 'https://sweaterplanet.com'
	},
	{
		name: 'Trigger.dev',
		description: "We built several open-source demos to showcase Trigger.dev's AI capabilities.",
		date: '2023',
		category: 'Client',
		link: 'https://autochangelog.dev'
	},
	{
		name: 'Graphite',
		description:
			'We built a platform to make an AI-directed video out of your GitHub activity. It was used by thousands of devs, which caused it to crash, so we parallelized the rendering engine and dynamically down-rezzed on mobile to scale.',
		backgroundImageUrl: '/images/graphite.png',
		image: (
			<div className="flex w-full flex-col gap-2">
				<div className="mr-auto rounded-custom bg-background px-2 py-1">enter your github username</div>
				<div className="ml-auto rounded-custom bg-background px-2 py-1">@carmenlala</div>
				<div className="flex flex-col gap-4 rounded-custom bg-background p-4">
					<div className="grid w-full grid-flow-col grid-rows-7 gap-1 overflow-hidden">
						{Array.from({ length: 7 * 52 }).map((_, index) => (
							<div
								key={index}
								className={cn('h-2 w-2', index % (index % 5) === 0 ? 'bg-secondary' : 'bg-subtle')}
							/>
						))}
					</div>
					<div className="flex items-center gap-6">
						<div className="text-center">
							<p className="text-2xl">468</p>
							<p>commits</p>
						</div>
						<div className="text-center">
							<p className="text-2xl">239</p>
							<p>PRs</p>
						</div>
						<div className="text-center">
							<p className="text-2xl">76</p>
							<p>followers</p>
						</div>
					</div>
				</div>
			</div>
		),
		date: '2024',
		category: 'Client',
		quote: 'Scaling personalized, generative video to 1000s of users',
		link: {
			label: 'Try it out',
			href: 'https://year-in-code.com'
		},
		secondaryLink: {
			label: 'Technical report',
			href: '/blog/personalized-video-at-scale'
		}
	},
	{
		name: 'Create Rubric App',
		description: 'Our CLI to spin up an AI-native React app.',
		date: '2024',
		category: 'Internal',
		link: 'https://todo.rubric.sh/'
	},
	{
		name: 'Greptile',
		description: 'We built a landing page and demo for Greptile.',
		date: '2024',
		category: 'Client',
		link: 'https://greptile.com'
	},
	{
		name: 'Series B stealth',
		description: 'We built a flagship AI-native product for this team.',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Cal.com',
		description:
			'We built the first version of Cal.ai. Now defunct, it was one of the first agents to go to market.',
		date: '2024',
		category: 'Client',
		link: {
			href: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant',
			label: 'Technical report'
		}
	},
	{
		name: 'Albertsons',
		description: 'Work in progress.',
		date: '2025',
		category: 'Client'
	},
	{
		name: 'Maige',
		description:
			'A profitable, open-source software for running LLM commands on your repo. Used by 4k+ teams.',
		date: '2023',
		category: 'Client'
	},
	{
		name: 'Sligo',
		description: 'We built a RAG and SQL generation system for Sligo.',
		date: '2024',
		category: 'Client',
		link: 'https://sligo.ai'
	},
	{
		name: 'Neat',
		description: 'Your GitHub feed, smartly filtered. Used by 2k+ developers.',
		date: '2022',
		category: 'Internal',
		link: 'https://neat.run'
	}
] satisfies Work[]

export const WorkTable = () => {
	const [highlightedWork, setHighlightedWork] = useState<string | null>(null)

	useEffect(() => {
		const hash = window.location.hash.slice(1)
		if (hash) {
			setHighlightedWork(hash)
			const element = document.getElementById(`work-${hash}`)

			element?.scrollIntoView({ behavior: 'smooth', block: 'center' })

			setTimeout(() => setHighlightedWork(null), TIMEOUT)
		}
	}, [])

	return (
		<div className="w-full max-w-4xl">
			<div className="flex flex-col gap-12">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<div
							key={index}
							id={`work-${work.name}`}
							className={`group h-fit w-full space-y-4 rounded-custom border p-4 px-6 text-secondary transition-colors duration-500 ${
								highlightedWork === work.name ? 'border-primary' : 'border-primary/0'
							}`}
						>
							<div className="flex justify-between">
								<h3 className="text-primary">{work.name}</h3>
								<div>{work.date}</div>
							</div>
							<div className="grid grid-cols-2 gap-6">
								<div className="flex w-full flex-col gap-4">
									{work.quote ? (
										<div className="text-5xl text-primary leading-12 tracking-tight">{work.quote}</div>
									) : null}
									{work.description ? <div>{work.description}</div> : null}
									<div className="grow" />
									<div className="flex items-center gap-2">
										{work.secondaryLink && typeof work.secondaryLink === 'object' ? (
											<Link href={work.secondaryLink.href}>
												<Button variant="outline">{work.secondaryLink.label}</Button>
											</Link>
										) : null}
										{work.link && typeof work.link === 'object' ? (
											<Link href={work.link.href}>
												<Button variant="default">{work.link.label}</Button>
											</Link>
										) : null}
									</div>
								</div>
								<div
									className={cn('relative w-full space-y-4 text-right', { 'aspect-square': work.image })}
								>
									{work.image ? (
										<div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center p-4">
											{work.image}
										</div>
									) : null}
									{work.backgroundImageUrl ? (
										<CustomImage
											src={work.backgroundImageUrl}
											alt={work.name}
											className="absolute top-0 h-full w-full object-cover"
										/>
									) : null}
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	)
}
