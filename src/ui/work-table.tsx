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
		backgroundImageUrl: '/images/gumloop-marketplace-screenshot.png',
		category: 'Client',
		date: '2025',
		description:
			'Gumloop is a fast-growing YC-backed AI automation platform ($23M+ raised) that enables non-technical users to build sophisticated workflows. We flew to San Francisco to work intensively with their team, building a marketplace that transforms their template ecosystem into a growth engine.',
		image: <div className="aspect-square" />,
		link: {
			href: '/blog/gumloop-templates',
			label: 'Read case study'
		},
		name: 'Gumloop',
		quote: 'Enabling creators to showcase their AI workflows',
		secondaryLink: {
			href: 'https://gumloop.com/templates',
			label: 'Try it out',
			target: '_blank'
		}
	},
	{
		category: 'Client',
		date: '2025',
		description:
			'Albertsons, a Fortune 500 company, is a major American grocery retailer, and operates numerous supermarket brands, including Safeway, Vons, and Jewel-Osco. We have been working with them on an ongoing project, details of which are not yet public.',
		name: 'Albertsons'
	},
	{
		backgroundImageUrl: '/images/graphite.png',
		category: 'Client',
		date: '2024',
		description:
			'Graphite is an AI developer productivity platform. We built a marketing product for Graphite to make AI-directed video using GitHub activity. It was used by thousands of devs, which caused it to crash, so we parallelized the rendering engine and dynamically down-rezzed on mobile to scale.',
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
		link: {
			href: '/blog/personalized-video-at-scale',
			label: 'Learn more'
		},
		name: 'Graphite',
		quote: 'Scaling personalized, generative video to 1000s of users',
		secondaryLink: {
			href: 'https://year-in-code.com',
			label: 'Try it out',
			target: '_blank'
		}
	},
	{
		category: 'Client',
		date: '2023',
		description:
			"Trigger is an AI infrastructure and background jobs platform for developers. The founders of Trigger wanted us to build several open-source demos to showcase Trigger.dev's AI capabilities. One of them was AutoChangelog, a tool that uses AI to generate changelogs for your GitHub repositories.",
		link: { href: 'https://trigger-ai-changelog.vercel.app', label: 'Try it out', target: '_blank' },
		name: 'Trigger.dev',
		secondaryLink: {
			href: 'https://github.com/triggerdotdev/ai-changelog',
			label: 'Check source code',
			target: '_blank'
		}
	},
	{
		backgroundImageUrl: '/images/cal.png',
		category: 'Client',
		date: '2024',
		description:
			'Cal.com is a fully customizable scheduling software for individuals and businesses. Peer, the founder, came to us with a vision of building a proof of concept of an AI-powered, email-first scheduling assistant. We ended up building Cal.ai, one of the first AI agents to go to market.',
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
		link: {
			href: 'https://blog.langchain.dev/how-to-design-an-agent-for-production/',
			label: 'Learn more',
			target: '_blank'
		},
		name: 'Cal.com',
		quote: 'Iterating toward production-ready agents.',
		secondaryLink: {
			href: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant',
			label: 'Visit website',
			target: '_blank'
		}
	},
	{
		category: 'Client',
		date: '2024',
		description:
			'dRisk is a fintech platform that instantly identifies new risk factors in the quarterly (10-Q) and annual (10-K) financial reports filed with the SEC. Evan, the founder, came to us with an idea and we implemented the platform end-to-end.',
		link: { href: 'https://d-risk.ai', label: 'Visit platform', target: '_blank' },
		name: 'dRisk'
	},
	{
		category: 'Client',
		date: '2024',
		description: 'Greptile is an AI code-review bot. We built a landing page and demo for Greptile.',
		link: { href: 'https://greptile.com', label: 'Visit website', target: '_blank' },
		name: 'Greptile'
	},
	{
		category: 'Client',
		date: '2023',
		description:
			'Maige is an open-source, intelligent codebase copilot for running LLM commands on your code repository. It has been used in 4000+ projects.',
		link: { href: 'https://maige.app', label: 'Try it out', target: '_blank' },
		name: 'Maige',
		secondaryLink: {
			href: 'https://github.com/rubricLab/maige',
			label: 'Check source code',
			target: '_blank'
		}
	},
	{
		category: 'Internal',
		date: '2024',
		description: 'Our CLI to spin up an AI-native React app.',
		link: {
			href: 'https://github.com/rubricLab/create-rubric-app',
			label: 'Check source code',
			target: '_blank'
		},
		name: 'Create Rubric App',
		secondaryLink: {
			href: '/blog/create-rubric-app',
			label: 'Read blog post'
		}
	},
	{
		category: 'Client',
		date: '2023',
		description:
			'SyncLinear is an open-source app which enables end-to-end sync of Linear tickets and GitHub issues. The team at cal.com came to us with the idea and we implemented the solution in collaboration. It serves 1000+ projects at no cost and is used by teams at PostHog, Vercel, Novu, and more.',
		link: { href: 'https://synclinear.com', label: 'Try it out', target: '_blank' },
		name: 'SyncLinear',
		secondaryLink: {
			href: 'https://github.com/calcom/synclinear.com',
			label: 'Check source code',
			target: '_blank'
		}
	},
	{
		category: 'Client',
		date: '2024',
		description: 'We built a flagship AI-native product for this team.',
		name: 'Series B stealth'
	},
	{
		category: 'Client',
		date: '2024',
		description: 'We built a RAG and SQL generation system for Sligo.',
		link: { href: 'https://sligo.ai', label: 'Visit website', target: '_blank' },
		name: 'Sligo'
	},
	{
		category: 'Client',
		date: '2024',
		description:
			'We built an enterprise booking platform for Weave to handle everything from POS to inventory management.',
		link: { href: 'https://weavein.co', label: 'Visit website', target: '_blank' },
		name: 'Weave'
	},
	{
		category: 'Internal',
		date: '2022',
		description: 'Your GitHub feed, smartly filtered. Used by 2k+ developers.',
		link: { href: 'https://neat.run', label: 'Visit website', target: '_blank' },
		name: 'Neat'
	},
	{
		category: 'Internal',
		date: '2022',
		description: 'We built a scalable eCommerce platform. Acquired.',
		link: { href: 'https://sweaterplanet.com', label: 'Visit website', target: '_blank' },
		name: 'Sweater Planet'
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
										<Link href={work.secondaryLink.href} target={work.secondaryLink.target ?? '_self'}>
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
