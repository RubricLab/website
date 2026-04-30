// Shared visual tokens for blog figures so each post stays brand-consistent
// (same outer chrome, same color shades, same opacity ramps).

export const FIGURE_CONTAINER_CLASS =
	'w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3'

export type BlockColor = {
	bg: string
	border: string
	text: string
	dimBg: string
	dimBorder: string
	dimText: string
}

export type BlockColorName = 'amber' | 'sky' | 'violet'

// Each entry follows the same opacity ramp: 500/15 fill, 500/40 border,
// 600/400 text for live blocks; 500/5, 500/10, 500/20 for dimmed states.
export const BLOCK_COLORS: Record<BlockColorName, BlockColor> = {
	amber: {
		bg: 'bg-amber-500/15',
		border: 'border-amber-500/40',
		dimBg: 'bg-amber-500/5',
		dimBorder: 'border-amber-500/10',
		dimText: 'text-amber-500/20',
		text: 'text-amber-600 dark:text-amber-400'
	},
	sky: {
		bg: 'bg-sky-500/15',
		border: 'border-sky-500/40',
		dimBg: 'bg-sky-500/5',
		dimBorder: 'border-sky-500/10',
		dimText: 'text-sky-500/20',
		text: 'text-sky-600 dark:text-sky-400'
	},
	violet: {
		bg: 'bg-violet-500/15',
		border: 'border-violet-500/40',
		dimBg: 'bg-violet-500/5',
		dimBorder: 'border-violet-500/10',
		dimText: 'text-violet-500/20',
		text: 'text-violet-600 dark:text-violet-400'
	}
}

export const FALLBACK_BLOCK_COLOR: BlockColor = {
	bg: '',
	border: '',
	dimBg: '',
	dimBorder: '',
	dimText: '',
	text: ''
}
