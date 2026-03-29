import { FadeIn } from './fade-in'

const capabilities = [
	{
		id: 'reasoning',
		title: 'CONTEXT ENGINEERING',
		body: 'System prompts, memory architecture, primitive design. We engineer the context that makes agents intelligent, not just responsive.'
	},
	{
		id: 'tools',
		title: 'ARCHITECTURE',
		body: 'Multi-agent orchestration, parallel tool execution, persistent memory, isolated infrastructure. Systems that work in production, not just in demos.'
	},
	{
		id: 'generative-ui',
		title: 'GENERATIVE UI',
		body: 'Structured outputs rendered as real interfaces. Not chat bubbles with markdown. Components composed by the agent, type-safe at every boundary.'
	},
	{
		id: 'memory',
		title: 'FINE-TUNING & RL',
		body: 'Synthetic data generation, preference training, domain-specific evaluation. We shape the model, not just the prompt.'
	}
]

export function Capabilities() {
	return (
		<section id="capabilities-section" className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{capabilities.map((cap, i) => (
					<FadeIn key={cap.id} delay={i * 0.08}>
						<div
							id={`capability-${cap.id}`}
							className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-8 hover:border-[#2A2A2A] transition-colors duration-200 h-full"
						>
							<h3 className="font-mono text-xs text-[#555555] tracking-widest uppercase mb-4">
								{cap.title}
							</h3>
							<p className="font-sans text-base text-[#888888] leading-relaxed">
								{cap.body}
							</p>
						</div>
					</FadeIn>
				))}
			</div>
		</section>
	)
}
