'use client'

import type { LayoutRef } from '../use-layout'
import type { HeroState } from '../scroll-phases'
import { ContextExpansion } from './context'
import { ArchitectureExpansion } from './architecture'
import { EvaluationExpansion } from './evaluation'
import { MarginText } from './margin-text'

const MARGIN_CONTENT = {
	context: {
		label: '01 — Context',
		heading: 'Every token is deliberate.',
		body: "The question you typed wasn't the prompt. Before the model saw anything, we assembled the real context window: a system prompt, retrieved documents scored for relevance, structured memory from a prior visit, and a schema constraining the format.\n\nOne source was retrieved and cut — it matched the query but would have diluted the answer. The system is selective. Context is finite.\n\nWhen the Safeway agent searches 250k products, the same architecture runs: retrieve, score, filter, assemble. Every token earns its place.",
	},
	architecture: {
		label: '02 — Architecture',
		heading: 'Four steps, three in parallel.',
		body: "\"Thought for 4 steps\" wasn't one API call. Three tasks ran simultaneously — retrieval, memory lookup, schema validation — then merged into inference. A fallback path handled failure before it reached the user.\n\nEvery Rubric system is a typed execution graph. When the Safeway agent searches inventory, it runs the same pattern: parallel retrieval strategies converging on a single ranked result. Inputs, outputs, and error handling are explicit at every node.",
	},
	evaluation: {
		label: '03 — Evaluation',
		heading: 'Every output is scored.',
		body: "Three iterations. Each scored on accuracy, relevance, and conciseness. Each set of scores feeds back into the next attempt. The response you read was the third — not the first draft, and not a lucky guess. The score was 91.\n\nThis is how every Rubric system handles output quality. The Safeway agent doesn't recommend the first product it finds — it generates candidates, scores them against the customer's constraints, and ships the best. The evaluation criteria are defined before the system runs. \"Best\" is never an opinion.",
	},
}

export function Expansions({ layoutRef, heroState }: {
	layoutRef: LayoutRef
	heroState: HeroState
}) {
	const layout = layoutRef.current
	if (!layout || layout.length < 4) return null
	if (!heroState.activeExpansion || heroState.expansionProgress < 0.01) return null

	const expansion = heroState.activeExpansion
	const content = MARGIN_CONTENT[expansion]

	return (
		<>
			{/* Margin text (positioned to the left of the chat) */}
			<div className="absolute" style={{
				right: 'calc(50% + 300px)',
				top: '15%',
				width: 280,
				maxWidth: 'calc(50vw - 320px)',
				zIndex: 15,
			}}>
				<MarginText
					label={content.label}
					heading={content.heading}
					body={content.body}
					progress={heroState.expansionProgress}
				/>
			</div>

			{/* Expansion content (positioned within/around the chat container) */}
			{expansion === 'context' && (
				<ContextExpansion
					bounds={layout[0]!}
					progress={heroState.expansionProgress}
				/>
			)}
			{expansion === 'architecture' && (
				<ArchitectureExpansion
					bounds={layout[1]!}
					progress={heroState.expansionProgress}
				/>
			)}
			{expansion === 'evaluation' && (
				<EvaluationExpansion
					bounds={layout[2]!}
					progress={heroState.expansionProgress}
				/>
			)}
		</>
	)
}
