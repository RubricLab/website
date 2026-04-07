'use client'

const traceLines = [
	{ desc: 'Screenshot: empty form. DOM: button disabled.', label: 'ui:compose:render', num: '1' },
	{ desc: 'Screenshot: fields populated. DOM: button enabled.', label: 'ui:compose:fill', num: '2' },
	{
		desc: 'Screenshot: loading spinner. DOM: inputs disabled.',
		label: 'ui:compose:submit',
		num: '3'
	},
	{ desc: 'Log: POST /api/email/send with payload.', label: 'api:send:request', num: '4' },
	{ desc: 'Gmail API returns 200, { messageId }.', label: 'provider:gmail:send', num: '5' },
	{ desc: "Row exists: status 'sent', message_id matches.", label: 'db:emails:insert', num: '6' },
	{ desc: 'Screenshot: success toast. DOM: fields cleared.', label: 'ui:compose:success', num: '7' },
	{
		desc: 'POST /api/webhook/gmail within 5s. Schema valid.',
		label: 'webhook:gmail:receive',
		num: '8'
	},
	{ desc: "Row exists: status 'received', thread linked.", label: 'db:emails:upsert', num: '9' },
	{ desc: 'PUBLISH inbox:{accountId} with emailId.', label: 'cache:redis:publish', num: '10' },
	{ desc: 'SSE delivers new_email. No page refresh.', label: 'realtime:sse:event', num: '11' },
	{
		desc: 'Screenshot: new email in list. DOM: correct subject.',
		label: 'ui:inbox:update',
		num: '12'
	}
]

function TraceBlock() {
	return (
		<div className="space-y-3 py-6">
			{traceLines.map(line => (
				<div key={line.num} className="flex gap-4 whitespace-nowrap">
					<span className="w-6 text-right text-text-tertiary/30">{line.num}</span>
					<span className="text-text-tertiary/15">
						{line.label.padEnd(24)}
						{line.desc}
					</span>
				</div>
			))}
		</div>
	)
}

export function ContractTrace() {
	return (
		<div
			className="absolute inset-0 z-0 hidden overflow-hidden md:block"
			style={{
				maskImage: 'linear-gradient(to bottom, transparent 5%, black 30%, black 70%, transparent 95%)',
				WebkitMaskImage:
					'linear-gradient(to bottom, transparent 5%, black 30%, black 70%, transparent 95%)'
			}}
		>
			<div className="flex h-full items-end justify-end pr-10">
				<div
					className="font-mono text-[13px] leading-relaxed"
					style={{
						animation: 'scroll-trace 40s linear infinite'
					}}
				>
					<TraceBlock />
					<TraceBlock />
					<TraceBlock />
				</div>
			</div>
		</div>
	)
}
