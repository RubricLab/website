import {Metadata} from 'next'
import {DEFAULT_META, META} from '../../lib/constants'
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

export default function Newsletter() {
	return (
		<main className='flex min-h-screen items-center justify-center px-5 sm:px-10'>
			<div className='flex w-full max-w-sm flex-col gap-8'>
				<div className='flex flex-col'>
					<h1>The Grid</h1>
					<div className='flex w-full flex-col gap-2 text-2xl'>
						<p>3 actionable insights. Once a week. Straight to your inbox.</p>
					</div>
				</div>
				<NewsletterForm />
			</div>
		</main>
	)
}
