'use client'

import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import type { Newsletter } from '~/types/sanity'
import copyToClipboard from '~/utils/copyToClipboard'
import BackgroundGrid from './BackgroundGrid'
import Button from './Button'
import { SanityComponents } from './Sanity'

export default function NewsletterPost({ post }: { post: Newsletter }) {
	const getPrevPostSlug = (currentSlug: string) => {
		const number: number = Number.parseInt(currentSlug)
		const previousNumber = number - 1
		return previousNumber.toString().padStart(3, '0') // Ensure slug is of '000' format
	}
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center px-5 sm:my-0 sm:px-10">
			<BackgroundGrid className="pointer-events-none absolute top-0 left-0 z-[-1] h-full w-screen" />
			<div className="my-28 flex w-full max-w-3xl flex-col gap-10 rounded-lg border border-neutral-500/10 bg-background p-5 dark:border-neutral-500/20">
				<div>
					<h1>{post.title}</h1>
					<Link href="/newsletter" className="no-underline">
						<h3>The Grid</h3>
					</Link>
				</div>
				<div className="flex flex-col gap-4">
					<p>Hi there,</p>
					<p>Welcome back to the Grid. You are 1 of {post.subscriberCount} builders receiving this.</p>
					<p>Three (or more) actionable bullets, once a week, let&apos;s dive in.</p>
					<PortableText value={post.body} components={SanityComponents} />
					<p>
						<span>What&apos;s something cool you learned this week? Just</span>{' '}
						<button
							type="button"
							className="font-semibold underline underline-offset-4 hover:opacity-80"
							onClick={() => copyToClipboard('hello@rubriclabs.com')}
						>
							email us
						</button>
						<span>. We read everything.</span>
					</p>
					<p>See you next week.</p>
					<div>
						<p>—</p>
						<Link className="font-neue-bit text-2xl no-underline" href={post.authorTwitter}>
							{post.authorName}
						</Link>
						<p className="opacity-60">
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</p>
					</div>
				</div>
				<div className="flex h-full flex-col items-center justify-end gap-2 sm:flex-row">
					{post.slug !== '001' && (
						<Button
							className="w-full sm:w-fit"
							body="See previous post"
							variant="ghost"
							href={getPrevPostSlug(post.slug)}
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
							icon={null as any}
						/>
					)}
					<Button body="Subscribe to The Grid" variant="dark" href="/newsletter" className="sm:w-fit" />
				</div>
			</div>
		</div>
	)
}
