import { NewsletterForm } from '~/app/(rest)/newsletter/newsletter-form'
import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import { getNewsletterMetadata } from '~/lib/utils/newsletters'
import { NewsletterList } from './newsletter-list'

const title = `The Grid | ${META.title}`
const description = `The Grid is a newsletter by Rubric Labs with three actionable insights on building, shipping, and scaling intelligent products. ${META.description}`

export const metadata = createMetadata({
	description,
	openGraph: {
		description,
		title
	},
	title,
	twitter: {
		description,
		title
	}
})

export default async function Page() {
	const newsletters = await getNewsletterMetadata()

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<div className="flex flex-col items-center gap-4 text-center">
				<h1>The Grid</h1>
				<p className="text-secondary">3 actionable insights. Once a week. Straight to your inbox.</p>
				<NewsletterForm className="w-full" />
			</div>
			<NewsletterList newsletters={newsletters} />
		</div>
	)
}
