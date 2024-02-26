import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Lab',
	description:
		'We make AI-enabled magical software. Rubric is a digital studio specializing in LangChain, Next.js, and AI-enabled product development.',
	path: 'lab'
})

export default function Lab() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<h1>Coming soon.</h1>
		</div>
	)
}
