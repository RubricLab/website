import type { Metadata } from 'next'
import { ContactForm } from '~/components/contact-form'

export const metadata: Metadata = {
	description: "Tell us what you're building. We take on a small number of engagements.",
	title: 'Contact'
}

export default function ContactPage() {
	return (
		<div className="mx-auto max-w-[1200px] px-6 pt-40 pb-32 md:px-10">
			<ContactForm />
		</div>
	)
}
