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
	target?: '_blank'
}

type Work = {
	name: string
	description: string
	date: string
	category: 'Client' | 'Internal'
	backgroundImageUrl?: string
	quote?: string
	image?: React.ReactNode
	link?: DemoLink
	secondaryLink?: DemoLink
}

const works = [
	{
		name: 'Albertsons',
		description:
			'Albertsons, a Fortune 500 company, is a major American grocery retailer, and operates numerous supermarket brands, including Safeway, Vons, and Jewel-Osco. We have been working with them on an ongoing project, details of which are not yet public.',
		date: '2025',
		category: 'Client'
	},
	{
		name: 'Graphite',
		description:
			'Graphite is an AI developer productivity platform. We built a marketing product for Graphite to make AI-directed video using GitHub activity. It was used by thousands of devs, which caused it to crash, so we parallelized the rendering engine and dynamically down-rezzed on mobile to scale.',
		backgroundImageUrl: '/images/graphite.png',
		image: (
			<div className="flex h-full w-full flex-col justify-center gap-2">
				<div className="mr-auto rounded-custom bg-background px-2 py-1">enter your github username</div>
				<div className="ml-auto rounded-custom bg-background px-2 py-1">@carmenlala</div>
				<div className="flex w-full flex-col gap-4 rounded-custom bg-background p-4">
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
			href: 'https://year-in-code.com',
			target: '_blank'
		},
		secondaryLink: {
			label: 'Read technical report',
			href: '/blog/personalized-video-at-scale'
		}
	},
	{
		name: 'Gumloop',
		description:
			'Gumloop is an AI-native automation platform. The founders, Rahul and Max, came to us with an impossible task — to rebuild their landing page and platform frontend in a few weeks. This was one of the most fun projects we have worked on.',
		date: '2023',
		category: 'Client',
		link: { label: 'Visit website', href: 'https://gumloop.com', target: '_blank' }
	},
	{
		name: 'Trigger.dev',
		description:
			"Trigger is an AI infrastructure and background jobs platform for developers. The founders of Trigger wanted us to build several open-source demos to showcase Trigger.dev's AI capabilities. One of them was AutoChangelog, a tool that uses AI to generate changelogs for your GitHub repositories.",
		date: '2023',
		category: 'Client',
		link: { label: 'Try it out', href: 'https://trigger-ai-changelog.vercel.app', target: '_blank' },
		secondaryLink: {
			label: 'Check source code',
			href: 'https://github.com/triggerdotdev/ai-changelog',
			target: '_blank'
		}
	},
	{
		name: 'Cal.com',
		description:
			'Cal.com is a fully customizable scheduling software for individuals and businesses. Peer, the founder, came to us with a vision of building a proof of concept of an AI-powered, email-first scheduling assistant. We ended up buiding Cal.ai, one of the first AI agents to go to market.',
		image: (
			<div className="flex h-full w-full flex-col gap-2">
				<div className="mr-auto flex flex-col rounded-custom bg-background p-4">
					<p>from: carmen@acme.com</p>
					<p className="opacity-70">to: Cal.ai</p>
					<p>is sydney@acme.com free on monday?</p>
				</div>
				<div className="ml-auto flex flex-col rounded-custom bg-background p-4">
					<p>from: Cal.ai</p>
					<p className="opacity-70">to: carmen@acme.com</p>
					<p>yes, sydney is free on monday</p>
				</div>
				<div className="mr-auto flex w-full flex-col rounded-custom bg-background p-4">
					<p>one on one with sydney</p>
					<p className="opacity-70">30 mins</p>
					<p className="opacity-70">24th june 2049</p>
					<div className="flex items-center gap-2 pt-2">
						<div className="rounded-custom border px-2">10am</div>
						<div className="rounded-custom border border-primary bg-primary px-2 text-background">
							10:30am
						</div>
						<div className="rounded-custom border px-2">2pm</div>
					</div>
				</div>
			</div>
		),
		backgroundImageUrl: '/images/cal.png',
		date: '2024',
		category: 'Client',
		link: {
			href: 'https://blog.langchain.dev/how-to-design-an-agent-for-production/',
			label: 'Read technical report',
			target: '_blank'
		},
		secondaryLink: {
			label: 'Visit website',
			href: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant',
			target: '_blank'
		},
		quote: 'Iterating toward production-ready agents.'
	},
	{
		name: 'dRisk',
		description:
			'dRisk is a fintech platform that instantly identifies new risk factors in the quarterly (10-Q) and annual (10-K) financial reports filed with the SEC. Evan, the founder, came to us with an idea and we implemented the platform end-to-end.',
		date: '2024',
		category: 'Client',
		link: { label: 'Visit platform', href: 'https://d-risk.ai', target: '_blank' }
	},
	{
		name: 'Greptile',
		description: 'We built a landing page and demo for Greptile.',
		date: '2024',
		category: 'Client',
		link: { label: 'Visit website', href: 'https://greptile.com', target: '_blank' }
	},
	{
		name: 'Maige',
		description:
			'A profitable, open-source software for running LLM commands on your repo. Used by 4k+ teams.',
		date: '2023',
		category: 'Client',
		link: { label: 'Visit website', href: 'https://maige.ai', target: '_blank' },
		secondaryLink: {
			label: 'Check source code',
			href: 'https://github.com/rubricLab/maige',
			target: '_blank'
		}
	},
	{
		name: 'Create Rubric App',
		description: 'Our CLI to spin up an AI-native React app.',
		date: '2024',
		category: 'Internal',
		link: {
			label: 'Check source code',
			href: 'https://github.com/rubricLab/create-rubric-app',
			target: '_blank'
		},
		secondaryLink: {
			label: 'Read blog post',
			href: '/blog/create-rubric-app'
		}
	},
	{
		name: 'SyncLinear',
		description:
			'SyncLinear is an open-source app which enables end-to-end sync of Linear tickets and GitHub issues. The team at cal.com came to us with the idea and we implemented the solution in collaboration. It serves 1000+ projects at no cost and is used by teams at PostHog, Vercel, Novu, and more.',
		date: '2023',
		category: 'Client',
		link: { label: 'Try it out', href: 'https://synclinear.com', target: '_blank' },
		secondaryLink: {
			label: 'Check source code',
			href: 'https://github.com/calcom/synclinear.com',
			target: '_blank'
		}
	},
	{
		name: 'Series B stealth',
		description: 'We built a flagship AI-native product for this team.',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Sligo',
		description: 'We built a RAG and SQL generation system for Sligo.',
		date: '2024',
		category: 'Client',
		link: { label: 'Visit website', href: 'https://sligo.ai', target: '_blank' }
	},
	{
		name: 'Weave',
		description:
			'We built an enterprise booking platform for Weave to handle everything from POS to inventory management.',
		date: '2024',
		category: 'Client',
		link: { label: 'Visit website', href: 'https://weavein.co', target: '_blank' }
	},
	{
		name: 'Neat',
		description: 'Your GitHub feed, smartly filtered. Used by 2k+ developers.',
		date: '2022',
		category: 'Internal',
		link: { label: 'Visit website', href: 'https://neat.run', target: '_blank' }
	},
	{
		name: 'Sweater Planet',
		description: 'We built a scalable eCommerce platform. Acquired.',
		date: '2022',
		category: 'Internal',
		link: { label: 'Visit website', href: 'https://sweaterplanet.com', target: '_blank' }
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
		<div className="flex flex-col gap-12">
			{works.map((work, index) => (
				<div
					key={index}
					id={`work-${work.name}`}
					className={`group flex h-fit w-full flex-col items-center justify-center rounded-custom border text-secondary transition-colors duration-500 sm:px-6 sm:py-4 ${
						highlightedWork === work.name ? 'border-primary' : 'border-primary/0'
					}`}
				>
					<div className="flex w-full items-center">
						<h3 className="text-primary">{work.name}</h3>
					</div>
					<div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
						<div className="flex h-full w-full flex-col justify-center gap-4">
							{work.quote && (
								<div className="text-5xl text-primary leading-12 tracking-tight">{work.quote}</div>
							)}
							{work.description && <div className="flex h-full flex-col">{work.description}</div>}
							{(work.link || work.secondaryLink) && (
								<div className="flex items-center gap-2">
									{work.link && (
										<Link href={work.link.href} target={work.link.target ?? '_self'}>
											<Button variant="default">{work.link.label}</Button>
										</Link>
									)}
									{work.secondaryLink && (
										<Link href={work.secondaryLink.href} target="_self">
											<Button variant="ghost">{work.secondaryLink.label}</Button>
										</Link>
									)}
								</div>
							)}
						</div>
						<div className="relative flex h-full w-full flex-col items-center justify-center">
							{work.image && <div className="z-10 h-full w-full shrink-0 p-4">{work.image}</div>}
							{work.backgroundImageUrl && (
								<CustomImage
									src={work.backgroundImageUrl}
									alt={work.name}
									className="absolute top-0 left-0 w-full object-cover saturate-[1.25] dark:saturate-[0.75]"
								/>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
