import { CTA } from '~/ui/cta'
import { WorkTable } from '~/ui/work-table'

export default function Page() {
	return (
		<div className="flex flex-col items-center gap-16 p-4 py-32">
			<WorkTable />
			<CTA />
		</div>
	)
}
