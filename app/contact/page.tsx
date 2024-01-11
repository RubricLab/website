import ContactForm from '~/components/ContactForm'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Contact',
	description:
		'Connect with Rubric to ideate, scope, build, and launch your next big feature.',
	path: 'contact'
})

export default function Contact() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 p-5 sm:px-10'>
			<h1>Get in touch</h1>
			<ContactForm />
		</div>
	)
}
