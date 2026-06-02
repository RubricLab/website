'use client'

import { useState } from 'react'
import { Field, Input, Logo, Phone } from './ui'

// ---------------------------------------------------------------------------
// V2 — smooth.
// Visual progress bar with labels. Inline, real-time validation with friendly
// microcopy. Sensible defaults (popular habits pre-selected). Optional steps are
// clearly skippable. Single-field account (email only — password set later).
// Connect step works and is skippable. Warm, celebratory success state.
// ---------------------------------------------------------------------------

const HABITS = [
	{ name: 'Daily standup', popular: true },
	{ name: 'Weekly 1:1', popular: true },
	{ name: 'Deep work block', popular: true },
	{ name: 'Code review', popular: false },
	{ name: 'Stretch break', popular: false },
	{ name: 'Journaling', popular: false },
	{ name: 'Reading', popular: false },
	{ name: 'No-meeting mornings', popular: false }
]
const STEPS = ['Account', 'Team', 'Habits', 'Connect']

const Progress = ({ step }: { step: number }) => (
	<div className="px-6 pt-2">
		<div className="flex gap-1.5">
			{STEPS.map((label, i) => (
				<div
					key={label}
					className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`}
				/>
			))}
		</div>
		<div className="mt-2 flex items-center justify-between">
			<span className="font-medium text-[12px] text-indigo-700">{STEPS[step - 1]}</span>
			<span className="text-[12px] text-gray-400">
				{step} of {STEPS.length}
			</span>
		</div>
	</div>
)

export const FlowV2 = () => {
	const [step, setStep] = useState(1)
	const [touched, setTouched] = useState(false)

	const [email, setEmail] = useState('')
	const [team, setTeam] = useState('')
	const [invite, setInvite] = useState('')
	const [picked, setPicked] = useState<string[]>(
		HABITS.filter(h => h.popular).map(h => h.name) // sensible defaults
	)
	const [tool, setTool] = useState('')

	const emailOk = /.+@.+\..+/.test(email)
	const emailError = touched && email && !emailOk ? "That doesn't look like an email yet" : ''

	function next() {
		if (step === 1 && !emailOk) {
			setTouched(true)
			return
		}
		setTouched(false)
		setStep(s => s + 1)
	}
	function back() {
		setTouched(false)
		setStep(s => Math.max(1, s - 1))
	}

	return (
		<Phone>
			<div className="px-6 pt-7 pb-1">
				<Logo />
			</div>
			{step < 5 && <Progress step={step} />}

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-28">
				{step === 1 && (
					<div className="space-y-4">
						<div>
							<h1 className="font-bold text-[24px] text-gray-900 leading-tight">Let's set up Cadence</h1>
							<p className="mt-1 text-[14px] text-gray-500">
								Just your email to start — takes about a minute.
							</p>
						</div>
						<Field label="Work email" error={emailError}>
							<Input
								value={email}
								inputMode="email"
								onChange={e => setEmail(e.target.value)}
								onBlur={() => setTouched(true)}
								placeholder="you@company.com"
								className={
									emailError
										? 'border-red-400 focus:border-red-500 focus:ring-red-100'
										: emailOk
											? 'border-green-400'
											: ''
								}
							/>
						</Field>
						{emailOk && <p className="text-[12px] text-green-600">Looks good ✓</p>}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-4">
						<div>
							<h1 className="font-bold text-[24px] text-gray-900 leading-tight">Name your team</h1>
							<p className="mt-1 text-[14px] text-gray-500">You can change this anytime.</p>
						</div>
						<Field label="Team name" hint="optional">
							<Input
								value={team}
								onChange={e => setTeam(e.target.value)}
								placeholder="e.g. Platform Squad"
							/>
						</Field>
						<Field label="Invite a teammate" hint="optional">
							<Input
								value={invite}
								onChange={e => setInvite(e.target.value)}
								placeholder="name@company.com"
							/>
						</Field>
						<p className="text-[12px] text-gray-400">
							No one to add yet? Skip it — you can invite people later.
						</p>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-4">
						<div>
							<h1 className="font-bold text-[24px] text-gray-900 leading-tight">Pick your habits</h1>
							<p className="mt-1 text-[14px] text-gray-500">
								We pre-selected the popular ones. Tweak away.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-2">
							{HABITS.map(h => {
								const on = picked.includes(h.name)
								return (
									<button
										key={h.name}
										type="button"
										onClick={() => setPicked(s => (on ? s.filter(x => x !== h.name) : [...s, h.name]))}
										className={`relative rounded-xl border px-3 py-2.5 text-left text-[12px] transition ${on ? 'border-indigo-500 bg-indigo-50 font-medium text-indigo-700' : 'border-gray-300 text-gray-700'}`}
									>
										{h.name}
										{on && <span className="absolute top-1.5 right-2 text-indigo-600">✓</span>}
									</button>
								)
							})}
						</div>
						<p className="text-[12px] text-gray-400">{picked.length} selected</p>
					</div>
				)}

				{step === 4 && (
					<div className="space-y-4">
						<div>
							<h1 className="font-bold text-[24px] text-gray-900 leading-tight">Connect a tool</h1>
							<p className="mt-1 text-[14px] text-gray-500">
								Optional — sync reminders where your team already works.
							</p>
						</div>
						<div className="space-y-2">
							{['Slack', 'GitHub', 'Linear', 'Notion'].map(t => (
								<button
									key={t}
									type="button"
									onClick={() => setTool(t)}
									className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-[14px] ${tool === t ? 'border-indigo-500 bg-indigo-50 font-medium' : 'border-gray-300'}`}
								>
									{t}
									{tool === t && <span className="text-indigo-600">✓ Connected</span>}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 5 && (
					<div className="pt-10 text-center">
						<div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-3xl text-white shadow-lg">
							🎉
						</div>
						<h1 className="mt-5 font-extrabold text-[26px] text-gray-900">You're all set!</h1>
						<p className="mt-2 text-[15px] text-gray-600">
							{team ? (
								<>
									Welcome to <span className="font-semibold">{team}</span>.
								</>
							) : (
								'Your workspace is ready.'
							)}
						</p>
						<div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-left">
							<p className="font-semibold text-[13px] text-indigo-700">{picked.length} habits tracking</p>
							<p className="mt-1 text-[12px] text-gray-500">First check-in lands tomorrow at 9:00am.</p>
						</div>
						<button
							type="button"
							className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-[15px] text-white"
						>
							Go to dashboard
						</button>
					</div>
				)}
			</div>

			{step < 5 && (
				<div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-gray-100 border-t bg-white/90 px-6 py-4 backdrop-blur">
					{step > 1 && (
						<button
							type="button"
							onClick={back}
							className="rounded-xl border border-gray-300 px-5 py-3.5 font-semibold text-[15px] text-gray-700"
						>
							Back
						</button>
					)}
					{(step === 2 || step === 4) && (
						<button type="button" onClick={next} className="px-2 font-semibold text-[14px] text-gray-500">
							Skip
						</button>
					)}
					<button
						type="button"
						onClick={next}
						disabled={step === 1 && !emailOk}
						className={`flex-1 rounded-xl py-3.5 font-semibold text-[15px] text-white transition ${step === 1 && !emailOk ? 'bg-gray-300' : 'bg-indigo-600'}`}
					>
						{step === 4 ? 'Finish setup' : 'Continue'}
					</button>
				</div>
			)}
		</Phone>
	)
}
