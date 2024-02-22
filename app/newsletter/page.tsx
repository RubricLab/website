import {Card} from '~/components/Card'
import NewsletterForm from '~/components/NewsletterForm'
import {getNewsletterPosts} from '~/sanity/utils'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'The Grid | Newsletter',
	description: '3 actionable insights. Once a week. Straight to your inbox.',
	path: 'newsletter',
	previewImageUrl: '/newsletter/opengraph-image'
})

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function Newsletter() {
	const posts = await getNewsletterPosts()
	return (
		<div className='my-32 flex w-full flex-col items-center justify-center gap-16 p-5 sm:flex-row sm:items-start sm:p-16'>
			<div className='top-48 flex flex-col justify-center gap-8 sm:sticky'>
				<div className='flex flex-col'>
					<h1>The Grid</h1>
					<div className='flex w-full flex-col gap-2 text-2xl'>
						<p>3 actionable insights. Once a week. Straight to your inbox.</p>
					</div>
				</div>
				<NewsletterForm />
			</div>
			<div className='flex w-full flex-col justify-center gap-8 sm:w-1/2'>
				<h2 className='text-secondary'>Past Newsletters</h2>
				<div className='grid gap-5'>
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
	)
}
