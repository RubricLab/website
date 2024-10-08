import { Button } from '@/common/ui/button'
import { useLoaded } from '@/hooks/use-loaded'
import type { BlogCategory, BlogPostCard } from '@/lib/basehub/fragments/blog'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { usePreviewStore } from '../preview-store'
import { BlogpostCard } from './blogpost-card'
import SearchEmptyStateIllustration from './empty-state'
import type { Search } from './search-container'

export interface SearchResultsProps {
	search?: Search
	posts: BlogPostCard[]
}

const DEBOUNCE_TIMEOUT = 100

export default function SearchResults({ posts, search }: SearchResultsProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const tag = searchParams.get('tag')
	const { setSelectedPost, clearSelectedPost } = usePreviewStore()
	const [localSelectedPost, setLocalSelectedPost] = useState<BlogPostCard | null>(null)
	const loaded = useLoaded()
	const tl = useRef(
		gsap.timeline({
			paused: true,
			defaults: {
				duration: 0.8,
				ease: 'power3.out'
			}
		})
	)
	const containerRef = useRef<HTMLDivElement>(null)
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	let filteredPosts = posts

	if (search?.result) {
		const resultsIds = search.result.hits.map(hit => hit.document._id)
		filteredPosts = posts.filter(post => resultsIds.includes(post._id))
	}

	if (tag)
		filteredPosts = filteredPosts.filter(post => post.categories.includes(tag as BlogCategory))

	useGSAP(
		() => {
			const container = containerRef.current
			if (!container) return
			const mainContainer = document.querySelector('#search-container')
			const posts = container.querySelectorAll('[data-post-id]')
			const dividers = container.querySelectorAll('[data-divider]')

			gsap.set([posts, dividers], {
				'--clip-progress': 1,
				clipPath: 'inset(0 0 calc(var(--clip-progress) * 100%) 0)'
			})

			gsap.set(mainContainer, {
				filter: 'blur(12px)',
				opacity: 0
			})

			tl.current
				.to(mainContainer, {
					delay: 0.5,
					filter: 'blur(0px)',
					opacity: 1
				})
				.to(
					[dividers, posts],
					{
						'--clip-progress': 0,
						stagger: 0.2
					},
					0.5
				)
		},
		{
			scope: containerRef,
			revertOnUpdate: true
		}
	)

	useEffect(() => {
		if (!loaded) return
		tl.current.play()
	}, [loaded])

	const handleMouseEnter = (post: BlogPostCard) => {
		setLocalSelectedPost(post)

		if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)

		// @ts-ignore
		debounceTimeoutRef.current = setTimeout(() => {
			setSelectedPost(post)
		}, DEBOUNCE_TIMEOUT)
	}

	const handleMouseLeave = (post: BlogPostCard) => {
		setLocalSelectedPost(null)

		if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
		// @ts-ignore
		debounceTimeoutRef.current = setTimeout(() => {
			clearSelectedPost(post)
		}, DEBOUNCE_TIMEOUT)
	}

	if (filteredPosts.length === 0 && search?.result)
		return (
			<>
				<span className="block h-em-[48] w-full border-border border-b bg-lines" />
				<div className="flex flex-col items-center justify-center gap-em-[12] py-em-[32]">
					<p className="text-em-[14/16] text-text-tertiary">
						No results found
						{/* @ts-ignore */}
						{search.query.length > 0 && <> for «{search.query}»</>}
					</p>
					<SearchEmptyStateIllustration className="w-em-[200] text-border" />
					<Button
						onClick={() => router.push('/blog')}
						variant="ghost"
						className="text-text-secondary underline underline-offset-[0.3em]"
					>
						Reset filters
					</Button>
				</div>
				<span className="block h-em-[48] w-full border-border border-t bg-lines" />
			</>
		)

	const [firstPost, ...remainingPosts] = filteredPosts

	return (
		<div ref={containerRef}>
			<span data-divider className="block h-em-[48] w-full border-border border-b bg-lines" />
			{firstPost && (
				<div className="relative flex items-center">
					<BlogpostCard
						data-post-id={firstPost._id}
						active={localSelectedPost?._id === firstPost._id}
						onMouseEnter={() => handleMouseEnter(firstPost)}
						onMouseLeave={() => handleMouseLeave(firstPost)}
						type="inline-card"
						{...firstPost}
					/>
					<span className="-left-sides pointer-events-none absolute hidden w-sides select-none justify-center text-em-[13/16] lg:flex">
						<span className="writing-vertical -rotate-180 relative block">LATEST_POST</span>
					</span>
				</div>
			)}
			<span data-divider className="block h-em-[32] w-full bg-lines" />
			<div className="flex flex-col">
				{remainingPosts.map(post => (
					<BlogpostCard
						data-post-id={post._id}
						active={localSelectedPost?._id === post._id}
						onMouseEnter={() => handleMouseEnter(post)}
						onMouseLeave={() => handleMouseLeave(post)}
						className="focus:z-10"
						key={post._id}
						{...post}
					/>
				))}
			</div>
		</div>
	)
}
