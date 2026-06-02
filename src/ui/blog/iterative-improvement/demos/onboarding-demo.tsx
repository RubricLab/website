'use client'

import { type ReactNode, useState } from 'react'
import { DemoSection } from './demo-row'
import { FlowV0 } from './onboarding/FlowV0'
import { FlowV1 } from './onboarding/FlowV1'
import { FlowV2 } from './onboarding/FlowV2'

// Three onboarding iterations side by side, each a self-contained clickable
// multi-step flow with local state. Iteration 0 is deliberately frictional
// (too many fields, dead-ends, no skip); iteration 2 is smooth. Each column
// has a Restart control that remounts its flow so the reader can replay it.
export const OnboardingDemoSection = () => {
	return (
		<DemoSection
			id="onboarding"
			title="3 · The onboarding flow"
			blurb="Click through each version. The early flow has friction the agent kept hitting; the final one is smooth."
			columns={[
				{
					body: <Replayable>{() => <FlowV0 />}</Replayable>,
					caption: 'friction',
					label: 'Iteration 0'
				},
				{ body: <Replayable>{() => <FlowV1 />}</Replayable>, caption: 'better', label: 'Iteration 1' },
				{ body: <Replayable>{() => <FlowV2 />}</Replayable>, caption: 'smooth', label: 'Iteration 2' }
			]}
		/>
	)
}

// Holds a remount key so "Restart" resets the wrapped flow's local state.
const Replayable = ({ children }: { children: () => ReactNode }) => {
	const [nonce, setNonce] = useState(0)
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => setNonce(n => n + 1)}
					className="rounded-full border border-subtle px-2.5 py-1 text-[11px] text-secondary transition-colors hover:text-primary"
				>
					Restart ↺
				</button>
			</div>
			<div key={nonce}>{children()}</div>
		</div>
	)
}
