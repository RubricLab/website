import { Button } from '@/common/ui/button'
import type { actionsFragment } from '@/lib/basehub/fragments'
import type { fragmentOn } from 'basehub'
import Link from 'next/link'

export type ActionsProps = fragmentOn.infer<typeof actionsFragment>

export const Actions = ({ size, actions }: ActionsProps) => {
	return (
		<div className="not-prose my-em-[44] flex gap-x-em-[24]">
			{actions?.map(b => {
				return (
					<Button
						className="w-full"
						asChild
						size={size === 'Large' ? 'lg' : 'md'}
						variant={b.type}
						key={b._id}
					>
						<Link href={b.href}>{b.label}</Link>
					</Button>
				)
			})}
		</div>
	)
}
