'use client'

import { cn } from '~/lib/utils/cn'

type Phase = 'gather' | 'action' | 'verify'

type Card = {
	title: string
	subtitle: string
	description: string
	phase: Phase
}

const phaseColors: Record<Phase, string> = {
	action: 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400',
	gather: 'bg-sky-500/20 border-sky-500/40 text-sky-600 dark:text-sky-400',
	verify: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400'
}

const CARDS: Card[] = [
	{
		description:
			'Read files, find the relevant code, and pull in just enough evidence to choose the next step.',
		phase: 'gather',
		subtitle: '(read)',
		title: 'Gather'
	},
	{
		description:
			'Make the change: edit code, write files, or run a command to move the task forward.',
		phase: 'action',
		subtitle: '(write)',
		title: 'Act'
	},
	{
		description:
			'Confirm it worked: inspect diffs, check errors, and run tests until the evidence is clean.',
		phase: 'verify',
		subtitle: '(test)',
		title: 'Verify'
	}
]

export const AgentLoopCards = () => {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{CARDS.map(card => (
				<div key={card.phase} className={cn('rounded-xl border p-4', phaseColors[card.phase])}>
					<p className="font-bold text-current text-sm uppercase tracking-wide opacity-80">
						{card.title} <span className="opacity-70">{card.subtitle}</span>
					</p>
					<p className="mt-2 text-current text-sm">{card.description}</p>
				</div>
			))}
		</div>
	)
}
