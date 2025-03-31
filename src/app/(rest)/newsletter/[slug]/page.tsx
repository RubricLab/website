import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { getNewsletter, getNewsletterSlugs } from '~/lib/utils/newsletters'
import { ExternalLinks } from './external-links'

export async function generateStaticParams() {
	const slugs = await getNewsletterSlugs()
	return slugs.map((slug: string) => ({ slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const newsletter = await getNewsletter(slug)

	if (!newsletter) return <div>Newsletter not found</div>

	const { default: MDXContent } = await evaluate(newsletter.body, runtime)

	return (
		<div className="min-h-screen w-screen p-4 py-32">
			<div className="mx-auto flex max-w-lg flex-col items-center gap-8">
				<h1>{newsletter.title}</h1>
				<article>
					<p>
						Welcome back to the Grid. You are 1 of {newsletter.subscriberCount} builders receiving this.
					</p>
					<ExternalLinks>
						<MDXContent />
					</ExternalLinks>
				</article>
			</div>
		</div>
	)
}
