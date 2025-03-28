'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Newsletter } from '~/lib/utils/newsletters'

export const NewsletterList = ({ newsletters }: { newsletters: Newsletter[] }) => {
	const [query, setQuery] = useState('')

	const filtered = useMemo(
		() =>
			newsletters.filter(
				newsletter => !query || newsletter.description.toLowerCase().includes(query.toLowerCase())
			),
		[newsletters, query]
	)

	return (
		<div className="grid h-fit w-full max-w-2xl divide-y divide-subtle">
			<div className="flex items-center justify-between gap-2 p-4">
				<h3>Past newsletters</h3>
				<input placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
			</div>
			{filtered.length > 0 ? (
				filtered.map(newsletter => (
					<Link
						href={`/newsletter/${newsletter.slug}`}
						key={newsletter.slug}
						className="overflow-hidden p-4 hover:bg-subtle"
					>
						<div className="flex flex-col gap-2">
							<h2>{newsletter.title}</h2>
							<p className="text-ellipsis text-secondary text-sm">{newsletter.description}</p>
						</div>
					</Link>
				))
			) : (
				<p className="p-4 text-center text-secondary text-sm">Keep searching...</p>
			)}
		</div>
	)
}
