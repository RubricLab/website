import {Metadata} from 'next'
import ContactForm from '~/components/ContactForm'
import {DEFAULT_META, META} from '~/constants/metadata'

export const metadata: Metadata = {
	...DEFAULT_META,
	openGraph: {
		...DEFAULT_META.openGraph,
		title: `Contact | ${META.title}`
	},
	title: `Contact | ${META.title}`,
	twitter: {
		...DEFAULT_META.twitter,
		title: `Contact | ${META.title}`
	}
}

export default function Contact() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 p-5 sm:px-10'>
			<h1>Get in touch</h1>
			<ContactForm />
		</div>
	)
}
