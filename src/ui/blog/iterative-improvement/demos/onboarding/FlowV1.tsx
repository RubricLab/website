'use client'

import { useState } from 'react'
import { Field, Input, Logo, Phone } from './ui'

// ---------------------------------------------------------------------------
// V1 — first round of fixes.
// Added: a step counter, a Back button, trimmed the account form, the connect
// step actually works, consistent-ish CTA. Still rough: progress is just text
// (no visual bar), validation still fires only on submit as a banner, invites
// still required (min 2), habits still need a manual pick, connect not skippable.
// ---------------------------------------------------------------------------

const HABITS = [
	'Daily standup',
	'Weekly 1:1',
	'Deep work block',
	'Code review',
	'Stretch break',
	'Journaling',
	'Reading',
	'No-meeting mornings'
]

export const FlowV1 = () => {
	const [step, setStep] = useState(1)
	const [banner, setBanner] = useState('')

	const [f, setF] = useState({ email: '', name: '', password: '' })
	const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
		setF(s => ({ ...s, [k]: e.target.value }))

	const [team, setTeam] = useState('')
	const [invites, setInvites] = useState(['', ''])
	const [picked, setPicked] = useState<string[]>([])
	const [tool, setTool] = useState('')

	function next() {
		setBanner('')
		if (step === 1) {
			if (!f.name || !f.email || !f.password) {
				setBanner('Please fill in every field.')
				return
			}
			if (!f.email.includes('@')) {
				setBanner('That email looks off.')
				return
			}
		}
		if (step === 2) {
			if (!team) {
				setBanner('Team name is required.')
				return
			}
			if (invites.filter(x => x.trim()).length < 2) {
				setBanner('Invite at least 2 teammates.')
				return
			}
		}
		if (step === 3 && picked.length === 0) {
			setBanner('Pick at least one habit.')
			return
		}
		if (step === 4 && !tool) {
			setBanner('Choose a tool to connect.')
			return
		}
		setStep(s => s + 1)
	}
	function back() {
		setBanner('')
		setStep(s => Math.max(1, s - 1))
	}

	return (
		<Phone>
			<div className="flex items-center justify-between px-6 pt-7 pb-2">
				<Logo />
				{step < 5 && <span className="text-[12px] text-gray-400">Step {step} of 4</span>}
			</div>

			{banner && (
				<div className="mx-6 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
					{banner}
				</div>
			)}

			<div className="flex-1 overflow-y-auto px-6 pb-28">
				{step === 1 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Create your account</h1>
						<Field label="Full name">
							<Input value={f.name} onChange={up('name')} />
						</Field>
						<Field label="Work email">
							<Input value={f.email} onChange={up('email')} />
						</Field>
						<Field label="Password">
							<Input type="password" value={f.password} onChange={up('password')} />
						</Field>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Name your team</h1>
						<Field label="Team name">
							<Input value={team} onChange={e => setTeam(e.target.value)} />
						</Field>
						<p className="text-[12px] text-gray-500">Invite teammates (at least 2).</p>
						{invites.map((v, i) => (
							<Input
								key={i}
								placeholder="name@company.com"
								value={v}
								onChange={e => setInvites(s => s.map((x, j) => (j === i ? e.target.value : x)))}
							/>
						))}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Pick your habits</h1>
						<div className="grid grid-cols-2 gap-2">
							{HABITS.map(h => {
								const on = picked.includes(h)
								return (
									<button
										key={h}
										type="button"
										onClick={() => setPicked(s => (on ? s.filter(x => x !== h) : [...s, h]))}
										className={`rounded-lg border px-2 py-2 text-left text-[12px] ${on ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700'}`}
									>
										{h}
									</button>
								)
							})}
						</div>
					</div>
				)}

				{step === 4 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Connect a tool</h1>
						{['Slack', 'GitHub', 'Linear', 'Notion'].map(t => (
							<button
								key={t}
								type="button"
								onClick={() => setTool(t)}
								className={`w-full rounded-xl border px-4 py-3 text-left text-[14px] ${tool === t ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
							>
								{t}
							</button>
						))}
					</div>
				)}

				{step === 5 && (
					<div className="space-y-3 pt-6 text-center">
						<div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl">
							✓
						</div>
						<h1 className="font-bold text-[22px] text-gray-900">You're all set</h1>
						<p className="text-[14px] text-gray-600">Welcome to {team || 'your team'}.</p>
					</div>
				)}
			</div>

			{step < 5 && (
				<div className="absolute inset-x-0 bottom-0 flex gap-3 border-gray-100 border-t bg-white px-6 py-4">
					{step > 1 && (
						<button
							type="button"
							onClick={back}
							className="rounded-xl border border-gray-300 px-5 py-3.5 font-semibold text-[15px] text-gray-700"
						>
							Back
						</button>
					)}
					<button
						type="button"
						onClick={next}
						className="flex-1 rounded-xl bg-indigo-600 py-3.5 font-semibold text-[15px] text-white"
					>
						{step === 4 ? 'Finish' : 'Continue'}
					</button>
				</div>
			)}
		</Phone>
	)
}
