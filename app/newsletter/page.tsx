import {Metadata} from 'next'
import {DEFAULT_META, META} from '../../lib/constants'
import {getNewsletterPosts} from '../../sanity/sanity-utils'
import {Card} from '../components/Card'
import NewsletterForm from '../components/NewsletterForm'

export const metadata: Metadata = {
	...DEFAULT_META,
	openGraph: {
		...DEFAULT_META.openGraph,
		title: `The Grid | Newsletter | ${META.title}`
	},
	title: `The Grid | Newsletter | ${META.title}`,
	twitter: {
		...DEFAULT_META.twitter,
		title: `The Grid | Newsletter | ${META.title}`
	}
}

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function Newsletter() {
	const posts = await getNewsletterPosts()
	return (
		<div className='grid min-h-screen w-full grid-cols-2 items-center justify-between px-5 sm:px-10'>
			<div className='flex w-full max-w-sm flex-col gap-8'>
				<div className='flex flex-col'>
					<h1>The Grid</h1>
					<div className='flex w-full flex-col gap-2 text-2xl'>
						<p>3 actionable insights. Once a week. Straight to your inbox.</p>
					</div>
				</div>
				<NewsletterForm />
			</div>
			<div className='flex flex-col gap-5'>
				<h2>Past Newsletters</h2>
				<div className='grid grid-cols-2 gap-5'>
					{posts.map(post => (
						<Card
							title={post.title}
							url={`/newsletter/${post.slug}`}
							body={new Date(post.publishedAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
							key={post._id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
