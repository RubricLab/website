import { NewsletterForm } from '~/app/(rest)/newsletter/newsletter-form'
import { getNewsletterMetadata } from '~/lib/utils/newsletters'
import { NewsletterList } from './newsletter-list'

export default async function Page() {
	const newsletters = await getNewsletterMetadata()

	return (
		<div className="mx-auto grid min-h-screen w-full max-w-5xl gap-8 px-6 py-32 sm:grid-cols-2">
			<div className="flex flex-col items-center gap-2 sm:items-end">
				<h1>The Grid</h1>
				<p className="text-secondary text-sm">
					3 actionable insights. Once a week. Straight to your inbox.
				</p>
				<NewsletterForm className="w-full" />
			</div>
			<NewsletterList newsletters={newsletters} />
		</div>
	)
}
