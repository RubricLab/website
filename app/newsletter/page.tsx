import {Metadata} from 'next'
import {Card} from '~/components/Card'
import NewsletterForm from '~/components/NewsletterForm'
import {DEFAULT_META, META} from '~/constants/metadata'
import {getNewsletterPosts} from '~/sanity/utils'

const data = {
	description: '3 actionable insights. Once a week. Straight to your inbox.',
	title: `The Grid | Newsletter | ${META.title}`
}

export const metadata: Metadata = {
	...DEFAULT_META,
	description: data.description,
	openGraph: {
		...DEFAULT_META.openGraph,
		description: data.description,
		title: data.title
	},
	title: data.title,
	twitter: {
		...DEFAULT_META.twitter,
		description: data.description,
		title: data.title
	}
}

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function Newsletter() {
	const posts = await getNewsletterPosts()
	return (
		<div className='flex w-full items-center justify-center px-5 py-40'>
			<div className='grid grid-cols-1 space-y-32'>
				<div className='flex w-full max-w-xl flex-col justify-center gap-8'>
					<div className='flex flex-col'>
						<h1>The Grid</h1>
						<div className='flex w-full flex-col gap-2 text-2xl'>
							<p>3 actionable insights. Once a week. Straight to your inbox.</p>
						</div>
					</div>
					<NewsletterForm />
				</div>
				<div className='flex w-full flex-col justify-center gap-8'>
					<h2>Past Newsletters</h2>
					<div className='grid grid-cols-1 gap-5'>
						{posts.map(post => (
							<Card
								body={new Date(post.publishedAt).toLocaleDateString('en-US', {
									day: 'numeric',
									month: 'short',
									year: 'numeric'
								})}
								key={post._id}
								title={post.title}
								url={`/newsletter/${post.slug}`}
								target='_parent'
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
