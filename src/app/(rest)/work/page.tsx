import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import { CTA } from '~/ui/cta'
import { WorkTable } from '~/ui/work-table'

const title = `Work | ${META.title}`
const description = `Client projects, case studies, and technical writing from the Rubric Labs team. ${META.description}`

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
		<div className="flex flex-col items-center p-4 py-32">
			<div className="flex max-w-4xl flex-col items-center gap-16">
				<div className="flex flex-col items-center gap-2">
					<h1>Work</h1>
					<p className="text-secondary">Our past projects and technical writing</p>
				</div>
				<WorkTable />
				<CTA />
			</div>
		</div>
	)
}
