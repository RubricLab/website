'use client'

import { cn } from '~/lib/utils/cn'

/**
 * Static terminal mockup showing an agent getting blocked.
 * No animation — just a realistic Claude Code session where
 * the agent tries to deploy, hits a permissions wall, and yields.
 */
export const PermissionsTrapFigure = () => {
	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 p-1">
			{/* Terminal chrome */}
			<div className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]">
				{/* Title bar */}
				<div className="flex items-center gap-1.5 border-b border-[#2a2a2a] px-3 py-1.5">
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
						<div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
						<div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
					</div>
					<span className="flex-1 text-center font-mono text-[10px] text-[#666]">
						claude — ~/project
					</span>
				</div>

				{/* Terminal content */}
				<div className="flex flex-col gap-0 px-4 py-3 font-mono text-[11px] leading-[1.7]">
					{/* User prompt */}
					<Line type="prompt">
						Deploy the OAuth login flow to production and verify it works end to end.
					</Line>

					{/* Agent working */}
					<Line type="agent">
						I&apos;ll set up the OAuth flow. Let me start by scaffolding the auth routes and configuring the Google OAuth credentials.
					</Line>

					<Line type="tool">
						<span className="text-[#6b7280]">Write</span>{' '}
						<span className="text-[#d4d4d4]">src/auth/google.ts</span>
					</Line>
					<Line type="result">✓ Created OAuth configuration with PKCE flow</Line>

					<Line type="tool">
						<span className="text-[#6b7280]">Write</span>{' '}
						<span className="text-[#d4d4d4]">src/auth/callback.ts</span>
					</Line>
					<Line type="result">✓ Created callback handler with session management</Line>

					{/* The block */}
					<Line type="tool">
						<span className="text-[#6b7280]">Bash</span>{' '}
						<span className="text-[#d4d4d4]">gcloud projects create oauth-test-47</span>
					</Line>
					<Line type="error">
						ERROR: (gcloud) PERMISSION_DENIED: caller does not have permission
					</Line>

					{/* Agent yields */}
					<div className="mt-1 border-l-2 border-[#f59e0b]/40 pl-3">
						<Line type="yield">
							I&apos;ve written the OAuth handlers, but I can&apos;t create the Google Cloud project needed for credentials. Can you create a project in the GCP console and add the OAuth redirect URI? I&apos;ll need the client ID and secret to continue.
						</Line>
					</div>
				</div>
			</div>
		</div>
	)
}

const Line = ({
	type,
	children,
}: {
	type: 'prompt' | 'agent' | 'tool' | 'result' | 'error' | 'yield'
	children: React.ReactNode
}) => {
	const styles: Record<string, string> = {
		prompt: 'text-[#e2e8f0]',
		agent: 'text-[#a3a3a3]',
		tool: 'text-[#818cf8]',
		result: 'text-[#4ade80]/70',
		error: 'text-[#f87171]',
		yield: 'text-[#fbbf24]/80',
	}

	const prefixes: Record<string, React.ReactNode> = {
		prompt: <span className="mr-2 text-[#818cf8]">❯</span>,
		agent: null,
		tool: <span className="mr-2 text-[#6b7280]">→</span>,
		result: <span className="mr-2">{'  '}</span>,
		error: <span className="mr-2">{'  '}</span>,
		yield: null,
	}

	return (
		<div className={cn('py-0.5', styles[type])}>
			{prefixes[type]}
			{children}
		</div>
	)
}
