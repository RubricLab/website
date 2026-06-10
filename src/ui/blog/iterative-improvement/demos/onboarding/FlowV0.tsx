'use client'

import { useState } from 'react'
import { Field, Input, Logo, Phone } from './ui'

// ---------------------------------------------------------------------------
// V0 — deliberately full of friction.
// No progress indicator. No back button. Too many fields. No inline validation
// (errors only blow up on submit, as a dead-end banner). No skip. Confusing,
// inconsistent CTA labels. No sensible defaults. The final step dead-ends.
// ---------------------------------------------------------------------------

const HABITS = [
	'Daily standup',
	'Weekly 1:1',
	'Inbox zero',
	'Deep work block',
	'Code review',
	'Hydration',
	'Stretch break',
	'Journaling',
	'Retro notes',
	'Gratitude log',
	'Reading',
	'No-meeting mornings'
]

export const FlowV0 = () => {
	const [step, setStep] = useState(1)
	const [banner, setBanner] = useState('')

	// step 1 — bloated account form
	const [f, setF] = useState({
		company: '',
		confirm: '',
		email: '',
		first: '',
		last: '',
		password: '',
		phone: '',
		source: '',
		title: ''
	})
	const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
		setF(s => ({ ...s, [k]: e.target.value }))

	// step 2
	const [team, setTeam] = useState('')
	const [invites, setInvites] = useState(['', '', ''])

	// step 3
	const [picked, setPicked] = useState<string[]>([])

	// step 4
	const [tool, setTool] = useState('')

	function submitAccount() {
		setBanner('')
		if (
			!f.first ||
			!f.last ||
			!f.email ||
			!f.password ||
			!f.confirm ||
			!f.phone ||
			!f.company ||
			!f.title ||
			!f.source
		) {
			setBanner('Error: all fields are required.')
			return
		}
		if (f.password !== f.confirm) {
			setBanner('Error: passwords do not match. Please re-enter everything.')
			return
		}
		setStep(2)
	}

	function submitTeam() {
		setBanner('')
		if (!team) {
			setBanner('Error: team name is required.')
			return
		}
		if (invites.filter(x => x.trim()).length < 3) {
			setBanner('Error: you must invite at least 3 teammates to continue.')
			return
		}
		setStep(3)
	}

	function submitHabits() {
		setBanner('')
		if (picked.length === 0) {
			setBanner('Error: select your habits.')
			return
		}
		setStep(4)
	}

	function submitTool() {
		setBanner('')
		if (!tool) {
			setBanner('Error: you must connect a tool to finish setup.')
			return
		}
		// dead-end: "connecting" always fails
		setBanner('Connection failed. Try a different integration.')
	}

	return (
		<Phone>
			<div className="px-6 pt-7 pb-3">
				<Logo />
			</div>

			{banner && (
				<div className="mx-6 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
					{banner}
				</div>
			)}

			<div className="flex-1 overflow-y-auto px-6 pb-28">
				{step === 1 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Create your account</h1>
						<Field label="First name">
							<Input value={f.first} onChange={up('first')} />
						</Field>
						<Field label="Last name">
							<Input value={f.last} onChange={up('last')} />
						</Field>
						<Field label="Work email">
							<Input value={f.email} onChange={up('email')} />
						</Field>
						<Field label="Password">
							<Input type="password" value={f.password} onChange={up('password')} />
						</Field>
						<Field label="Confirm password">
							<Input type="password" value={f.confirm} onChange={up('confirm')} />
						</Field>
						<Field label="Phone number">
							<Input value={f.phone} onChange={up('phone')} />
						</Field>
						<Field label="Company">
							<Input value={f.company} onChange={up('company')} />
						</Field>
						<Field label="Job title">
							<Input value={f.title} onChange={up('title')} />
						</Field>
						<Field label="How did you hear about us?">
							<Input value={f.source} onChange={up('source')} />
						</Field>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Team details</h1>
						<Field label="Team name">
							<Input value={team} onChange={e => setTeam(e.target.value)} />
						</Field>
						<p className="text-[12px] text-gray-500">Invite teammates (minimum 3 required).</p>
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
						<h1 className="font-bold text-[22px] text-gray-900">Choose habits</h1>
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
						<p className="text-[12px] text-gray-500">A connected integration is required to finish.</p>
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
					<div className="space-y-3">
						<h1 className="font-bold text-[22px] text-gray-900">Setup complete.</h1>
						<p className="text-[14px] text-gray-600">Your account has been created.</p>
					</div>
				)}
			</div>

			{/* sticky CTA — inconsistent labels, no back button */}
			{step < 5 && (
				<div className="absolute inset-x-0 bottom-0 border-gray-100 border-t bg-white px-6 py-4">
					{step === 1 && <Cta onClick={submitAccount} label="Proceed" />}
					{step === 2 && <Cta onClick={submitTeam} label="Commit team" />}
					{step === 3 && <Cta onClick={submitHabits} label="Apply selections" />}
					{step === 4 && <Cta onClick={submitTool} label="Finalize setup" />}
				</div>
			)}
		</Phone>
	)
}

const Cta = ({ onClick, label }: { onClick: () => void; label: string }) => (
	<button
		type="button"
		onClick={onClick}
		className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-[15px] text-white"
	>
		{label}
	</button>
)
