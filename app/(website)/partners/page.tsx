import Button from '~/components/Button'
import { Card } from '~/components/Card'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Partners',
	description:
		'We work with startups big and small to ship AI-enabled software. We are proud to have worked with Graphite.dev, Cal.com, and Trigger.dev, among many others. Join the list.',
	path: 'partners'
})

const partners = [
	{
		description: 'Vercel makes it easy for engineers to deploy and run web applications.',
		href: 'https://vercel.com/experts/rubric',
		title: 'Vercel'
	},
	{
		description:
			'LangChain is a framework for building LLM applications from prototype to production.',
		href: 'https://www.langchain.com/partners',
		title: 'LangChain'
	}
]

const Partners = async () => {
	return (
		<div className="my-32 flex w-full flex-col items-center 2xl:justify-center">
			<div className="flex h-full w-full max-w-4xl flex-col gap-16 p-5">
				<h1>Partners</h1>
				<div className="grid gap-5 sm:grid-cols-2">
					{partners
						.sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
						.map(partner => (
							<Card
								body={partner.description}
								key={partner.title}
								title={partner.title}
								url={partner.href}
							/>
						))}
				</div>
				<Button body="Want to partner with us?" href="/contact" variant="light" />
			</div>
		</div>
	)
}

export default Partners
