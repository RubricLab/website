'use client'

import { cn } from '~/lib/utils/cn'

type Phase = 'gather' | 'action' | 'verify'

type Tool = {
	name: string
	description: string
	phase: Phase
	examples?: string[]
	docUrl?: string
}

const DOCS_BASE = 'https://platform.claude.com/docs/en/agents-and-tools/tool-use'

const TOOLS: Tool[] = [
	{ description: 'Read any file in the working directory', name: 'Read', phase: 'gather' },
	{ description: 'Create new files', name: 'Write', phase: 'action' },
	{
		description: 'Make precise edits to existing files',
		docUrl: `${DOCS_BASE}/text-editor-tool`,
		name: 'Edit',
		phase: 'action'
	},
	{
		description: 'Run terminal commands, scripts, git operations',
		docUrl: `${DOCS_BASE}/bash-tool`,
		name: 'Bash',
		phase: 'action'
	},
	{
		description: 'Find files by pattern',
		examples: ['**/*.ts', 'src/**/*.py'],
		name: 'Glob',
		phase: 'gather'
	},
	{ description: 'Search file contents with regex', name: 'Grep', phase: 'gather' },
	{
		description: 'Search the web for current information',
		docUrl: `${DOCS_BASE}/web-search-tool`,
		name: 'WebSearch',
		phase: 'gather'
	},
	{
		description: 'Fetch and parse web page content',
		docUrl: `${DOCS_BASE}/web-fetch-tool`,
		name: 'WebFetch',
		phase: 'gather'
	},
	{
		description: 'Ask clarifying questions with multiple choice',
		name: 'AskUserQuestion',
		phase: 'gather'
	}
]

const phaseColors: Record<Phase, string> = {
	action: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
	gather: 'bg-sky-500/20 text-sky-600 dark:text-sky-400',
	verify: 'bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400'
}

const phaseLabels: Record<Phase, string> = {
	action: 'Action',
	gather: 'Gather',
	verify: 'Verify'
}

export const ToolsTable = () => {
	return (
		<div className="overflow-x-auto rounded-lg border border-subtle">
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="border-subtle border-b bg-subtle/30">
						<th className="px-4 py-3 font-medium text-secondary">Tool</th>
						<th className="px-4 py-3 font-medium text-secondary">What it does</th>
						<th className="px-4 py-3 font-medium text-secondary">Phase</th>
					</tr>
				</thead>
				<tbody>
					{TOOLS.map((tool, idx) => (
						<tr key={tool.name} className={cn('border-subtle', idx !== TOOLS.length - 1 && 'border-b')}>
							<td className="px-4 py-3 font-medium">
								{tool.docUrl ? (
									<a
										href={tool.docUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="underline decoration-secondary/50 underline-offset-2 transition-colors hover:text-sky-500"
									>
										{tool.name}
									</a>
								) : (
									tool.name
								)}
							</td>
							<td className="px-4 py-3 text-secondary">
								{tool.description}
								{tool.examples && (
									<span className="ml-1">
										(
										{tool.examples.map((ex, i, arr) => (
											<span key={ex}>
												<code className="rounded bg-subtle px-1 py-0.5 font-mono text-xs">{ex}</code>
												{i < arr.length - 1 && ', '}
											</span>
										))}
										)
									</span>
								)}
							</td>
							<td className="px-4 py-3">
								<span
									className={cn(
										'inline-block rounded-full px-2 py-0.5 font-medium text-xs',
										phaseColors[tool.phase]
									)}
								>
									{phaseLabels[tool.phase]}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
