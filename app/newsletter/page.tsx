import NewsletterForm from '../components/NewsletterForm'

export default function Newsletter() {
	return (
		<main className='flex min-h-screen items-center justify-center'>
			<div className='flex w-full max-w-3xl flex-col items-center gap-10'>
				<h1>The Grid</h1>
				<div className='flex flex-col gap-2'>
					<h2>3 bullets.</h2>
					<h2>Every Tuesday in your inbox.</h2>
				</div>
				<NewsletterForm />
			</div>
		</main>
	)
}
