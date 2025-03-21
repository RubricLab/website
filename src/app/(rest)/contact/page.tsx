import { ContactForm } from './contact-form'

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-16 py-32">
			<div className="flex w-full max-w-lg flex-col items-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<h1>Contact</h1>
					<p className="text-secondary text-sm">Get in touch with us</p>
				</div>
				<ContactForm />
			</div>
		</div>
	)
}
