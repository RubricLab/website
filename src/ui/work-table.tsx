'use client'

import { useEffect, useState } from 'react'
import { TIMEOUT } from '~/lib/constants'

type Work = {
	name: string
	description: string
	date: string
	category: 'Client' | 'Internal'
	link?: string
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
			"We built Year in Code with Graphite: personalized videos celebrating developers' coding milestones.",
		date: '2024',
		category: 'Client',
		link: 'https://graphite.dev'
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
		link: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant'
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
		<div className="w-full max-w-2xl">
			<div className="flex flex-col gap-12">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<div
							key={index}
							id={`work-${work.name}`}
							className={`group flex w-full items-start justify-between rounded-custom border p-4 px-6 text-secondary transition-colors duration-500 ${
								highlightedWork === work.name ? 'border-primary' : 'border-background'
							}`}
						>
							<div className="w-full">
								<h3 className="text-primary">{work.name}</h3>
								{work.description ? <div className="max-w-2/3">{work.description}</div> : null}
							</div>
							<div>{work.date}</div>
						</div>
					))}
			</div>
		</div>
	)
}
