import { ContactForm } from './contact-form'

export default function Page() {
	return (
		<div className="flex min-h-screen max-w-full flex-col items-center justify-center gap-16 p-4 py-32">
			<div className="flex w-full max-w-lg flex-col items-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<h1>Contact</h1>
					<p className="text-secondary">Get in touch with us</p>
				</div>
				<ContactForm />
			</div>
		</div>
	)
}
