'use client'

import { cn } from '~/lib/utils/cn'

type Phase = 'gather' | 'action' | 'verify'

type Tool = {
	name: string
	description: string
	phases: Phase[]
	permissionRequired: boolean
	group: 'core' | 'tasks' | 'mcp' | 'editing' | 'skills' | 'control' | 'intelligence'
	examples?: string[]
	docUrl?: string
}

const DOCS_BASE = 'https://platform.claude.com/docs/en/agents-and-tools/tool-use'

const TOOLS: Tool[] = [
	// Core tools (the loop spends most of its time here)
	{
		description: 'Asks multiple-choice questions to gather requirements or clarify ambiguity',
		group: 'core',
		name: 'AskUserQuestion',
		permissionRequired: false,
		phases: ['gather']
	},
	{
		description: 'Executes shell commands in your environment',
		docUrl: `${DOCS_BASE}/bash-tool`,
		group: 'core',
		name: 'Bash',
		permissionRequired: true,
		phases: ['action', 'verify']
	},
	{
		description: 'Makes targeted edits to specific files',
		docUrl: `${DOCS_BASE}/text-editor-tool`,
		group: 'core',
		name: 'Edit',
		permissionRequired: true,
		phases: ['action']
	},
	{
		description: 'Finds files based on pattern matching',
		examples: ['**/*.ts', 'src/**/*.py'],
		group: 'core',
		name: 'Glob',
		permissionRequired: false,
		phases: ['gather', 'verify']
	},
	{
		description: 'Searches for patterns in file contents',
		group: 'core',
		name: 'Grep',
		permissionRequired: false,
		phases: ['gather', 'verify']
	},
	{
		description: 'Reads the contents of files',
		group: 'core',
		name: 'Read',
		permissionRequired: false,
		phases: ['gather', 'verify']
	},
	{
		description: 'Fetches content from a specified URL',
		docUrl: `${DOCS_BASE}/web-fetch-tool`,
		group: 'core',
		name: 'WebFetch',
		permissionRequired: true,
		phases: ['gather', 'verify']
	},
	{
		description: 'Performs web searches with domain filtering',
		docUrl: `${DOCS_BASE}/web-search-tool`,
		group: 'core',
		name: 'WebSearch',
		permissionRequired: true,
		phases: ['gather', 'verify']
	},
	{
		description: 'Creates or overwrites files',
		group: 'core',
		name: 'Write',
		permissionRequired: true,
		phases: ['action']
	},

	// Task / subagent workflow tools
	{
		description: 'Runs a sub-agent to handle complex, multi-step tasks',
		group: 'tasks',
		name: 'Task',
		permissionRequired: false,
		phases: ['gather']
	},
	{
		description: 'Creates a new task in the task list',
		group: 'tasks',
		name: 'TaskCreate',
		permissionRequired: false,
		phases: ['gather']
	},
	{
		description: 'Retrieves full details for a specific task',
		group: 'tasks',
		name: 'TaskGet',
		permissionRequired: false,
		phases: ['gather']
	},
	{
		description: 'Lists all tasks with their current status',
		group: 'tasks',
		name: 'TaskList',
		permissionRequired: false,
		phases: ['gather']
	},
	{
		description: 'Retrieves output from a background task (bash shell or subagent)',
		group: 'tasks',
		name: 'TaskOutput',
		permissionRequired: false,
		phases: ['verify']
	},
	{
		description: 'Updates task status, dependencies, or details',
		group: 'tasks',
		name: 'TaskUpdate',
		permissionRequired: false,
		phases: ['action']
	},

	// MCP-related tools
	{
		description: 'Searches for and loads MCP tools when tool search is enabled',
		group: 'mcp',
		name: 'MCPSearch',
		permissionRequired: false,
		phases: ['gather']
	},

	// Editing helpers beyond core file edits
	{
		description: 'Modifies Jupyter notebook cells',
		group: 'editing',
		name: 'NotebookEdit',
		permissionRequired: true,
		phases: ['action']
	},

	// Skills / guidance
	{
		description: 'Executes a skill within the main conversation',
		group: 'skills',
		name: 'Skill',
		permissionRequired: true,
		phases: ['gather']
	},

	// Session/control helpers
	{
		description: 'Prompts the user to exit plan mode and start coding',
		group: 'control',
		name: 'ExitPlanMode',
		permissionRequired: true,
		phases: ['action']
	},
	{
		description: 'Kills a running background bash shell by its ID',
		group: 'control',
		name: 'KillShell',
		permissionRequired: false,
		phases: ['verify']
	},

	// Code intelligence
	{
		description: 'Code intelligence via language servers (type errors, go-to-def, references, etc.)',
		group: 'intelligence',
		name: 'LSP',
		permissionRequired: false,
		phases: ['verify']
	}
]

const CORE_TOOLS = TOOLS.filter(t => t.group === 'core')

export const CORE_TOOL_NAMES = CORE_TOOLS.map(t => t.name)

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
						<th className="w-40 px-4 py-3 font-medium text-secondary">Phase</th>
					</tr>
				</thead>
				<tbody>
					{CORE_TOOLS.map((tool, idx) => (
						<tr key={tool.name} className={cn('border-subtle', idx !== CORE_TOOLS.length - 1 && 'border-b')}>
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
							<td className="w-40 px-4 py-3">
								<div className="flex gap-1 whitespace-nowrap">
									{tool.phases.map(phase => (
										<span
											key={`${tool.name}-${phase}`}
											className={cn(
												'inline-block rounded-full px-2 py-0.5 font-medium text-xs',
												phaseColors[phase]
											)}
										>
											{phaseLabels[phase]}
										</span>
									))}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
