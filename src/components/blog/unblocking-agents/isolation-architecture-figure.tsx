'use client'

import { cn } from '~/lib/utils/cn'

/**
 * Static diagram showing two isolated resource islands:
 * Your Org (locked down) and Agent World (full access),
 * with a project fork arrow connecting them.
 */

type Resource = { label: string; detail: string }

const YOUR_ORG: Resource[] = [
	{ label: 'GitHub', detail: 'rubriclabs/*' },
	{ label: 'AWS', detail: 'prod account' },
	{ label: 'Vercel', detail: 'rubriclabs.com' },
	{ label: 'Database', detail: 'prod Postgres' },
]

const AGENT_WORLD: Resource[] = [
	{ label: 'GitHub', detail: 'agent-org/*' },
	{ label: 'AWS', detail: 'sandbox account' },
	{ label: 'GCP', detail: 'isolated project' },
	{ label: 'Vercel', detail: 'agent.dev' },
	{ label: 'Postgres', detail: 'own instance' },
	{ label: 'Redis', detail: 'own instance' },
	{ label: 'Domain', detail: 'DNS + TLS' },
	{ label: 'Email', detail: 'agent@workspace' },
	{ label: 'Browser', detail: 'Playwright' },
	{ label: 'Shell', detail: 'root VM' },
	{ label: 'Card', detail: '$100 limit' },
	{ label: 'IP', detail: 'static + inbound' },
]

const ResourceItem = ({ resource, dimmed }: { resource: Resource; dimmed?: boolean }) => (
	<div className={cn(
		'flex items-center justify-between gap-2 py-0.5 transition-all',
		dimmed ? 'opacity-40' : ''
	)}>
		<span className="font-mono text-[10px] text-primary/80">{resource.label}</span>
		<span className="font-mono text-[8px] text-secondary/40">{resource.detail}</span>
	</div>
)

export const IsolationArchitectureFigure = () => {
	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1.5fr]">
				{/* Your Org — locked */}
				<div className="rounded-lg border border-subtle/60 p-3">
					<div className="mb-2 flex items-center justify-between">
						<span className="font-mono text-[9px] uppercase tracking-wide text-secondary/50">Your Org</span>
						<span className="font-mono text-[8px] text-red-500/50">read-only</span>
					</div>
					<div className="flex flex-col gap-0.5">
						{YOUR_ORG.map(r => (
							<ResourceItem key={r.label} resource={r} dimmed />
						))}
					</div>
				</div>

				{/* Fork arrow */}
				<div className="flex items-center justify-center sm:flex-col sm:gap-1">
					{/* Mobile: horizontal */}
					<div className="flex items-center gap-1 sm:hidden">
						<div className="h-px w-6 bg-secondary/20" />
						<span className="font-mono text-[8px] text-secondary/30">fork</span>
						<svg className="h-3 w-3 text-secondary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<title>Fork arrow</title>
							<path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
					{/* Desktop: vertical-ish */}
					<div className="hidden sm:flex sm:flex-col sm:items-center sm:gap-1">
						<svg className="h-4 w-4 text-secondary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<title>Fork arrow</title>
							<path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span className="font-mono text-[7px] text-secondary/25">fork into<br />agent org</span>
					</div>
				</div>

				{/* Agent World — full access */}
				<div className="rounded-lg border-2 border-emerald-500/20 p-3">
					<div className="mb-2 flex items-center justify-between">
						<span className="font-mono text-[9px] uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70">Agent World</span>
						<span className="font-mono text-[8px] text-emerald-500/50">full access</span>
					</div>
					<div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
						{AGENT_WORLD.map(r => (
							<ResourceItem key={r.label} resource={r} />
						))}
					</div>
				</div>
			</div>

			{/* Isolation boundary */}
			<div className="mt-4 flex items-center gap-3">
				<div className="h-px flex-1 border-t border-dashed border-secondary/15" />
				<span className="font-mono text-[8px] text-secondary/25">separate orgs · separate billing · can&apos;t touch production</span>
				<div className="h-px flex-1 border-t border-dashed border-secondary/15" />
			</div>
		</div>
	)
}
