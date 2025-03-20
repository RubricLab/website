import { getNewsletter } from '~/lib/utils/newsletters'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const newsletter = await getNewsletter(slug)

	return (
		<div className="min-h-screen w-screen gap-8 px-6 py-32">
			<div className="mx-auto flex max-w-lg flex-col items-center gap-4">
				<h1>{newsletter.title}</h1>
				<p className="text-secondary text-sm">
					Welcome back to the Grid. You are 1 of {newsletter.subscriberCount} builders receiving this.
				</p>
				<p>{newsletter.description}</p>
			</div>
		</div>
	)
}
