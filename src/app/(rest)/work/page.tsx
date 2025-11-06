import { CTA } from '~/ui/cta'
import { WorkTable } from '~/ui/work-table'

export default function Page() {
	return (
		<div className="flex flex-col items-center p-4 py-32">
			<div className="flex max-w-4xl flex-col items-center gap-16">
				<div className="flex flex-col items-center gap-2">
					<h1 className="page-title">Work</h1>
					<p className="text-secondary">Our past projects and technical writing</p>
				</div>
				<WorkTable />
				<CTA />
			</div>
		</div>
	)
}
