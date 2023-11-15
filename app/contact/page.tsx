import ContactForm from '~/components/ContactForm'

export default function Contact() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-8 p-5 sm:px-10'>
			<h1>Get in touch</h1>
			<ContactForm />
		</div>
	)
}
