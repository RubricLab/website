import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import { ContactForm } from './contact-form'

const title = `Contact | ${META.title}`
const description = `Get in touch to discuss AI product strategy, implementation, and collaboration. ${META.description}`

export const metadata = createMetadata({
	description,
	openGraph: {
		description,
		title
	},
	title,
	twitter: {
		description,
		title
	}
})

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
