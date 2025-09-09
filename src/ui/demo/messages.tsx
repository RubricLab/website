'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { Message } from './message'

// Script describes when each message appears (at) and optionally disappears (hideAfter), in ms
type ScriptItem = { at: number; hideAfter?: number; node: ReactNode }

const SCRIPT: ScriptItem[] = [
	{
		at: 0,
		node: (
			<Message
				type={'user'}
				parts={[
					{ content: 'How many people visited our website ', type: 'text' },
					{ content: 'today', type: 'tag' },
					{ content: ' ?', type: 'text' }
				]}
			/>
		)
	},
	{ at: 1000, hideAfter: 1500, node: <Message type={'reasoning'} text="Thinking..." /> },
	{ at: 2500, hideAfter: 1000, node: <Message type={'reasoning'} text="Querying database..." /> },

	{
		at: 3500,
		node: (
			<Message
				type={'chart'}
				data={[
					{ name: '0:00', value: 22 },
					{ name: '1:00', value: 16 },
					{ name: '2:00', value: 11 },
					{ name: '3:00', value: 17 },
					{ name: '4:00', value: 13 },
					{ name: '5:00', value: 38 },
					{ name: '6:00', value: 74 },
					{ name: '7:00', value: 121 },
					{ name: '8:00', value: 205 },
					{ name: '9:00', value: 362 },
					{ name: '10:00', value: 410 },
					{ name: '11:00', value: 495 },
					{ name: '12:00', value: 452 },
					{ name: '13:00', value: 840 },
					{ name: '14:00', value: 615 },
					{ name: '15:00', value: 1002 },
					{ name: '16:00', value: 742 },
					{ name: '17:00', value: 905 },
					{ name: '18:00', value: 560 },
					{ name: '19:00', value: 688 },
					{ name: '20:00', value: 372 },
					{ name: '21:00', value: 448 },
					{ name: '22:00', value: 210 },
					{ name: '23:00', value: 790 },
					{ name: '24:00', value: 88 }
				]}
			/>
		)
	},
	{ at: 3700, node: <Message type={'stats'} data={{ active: 100, total: 11507 }} /> },
	{
		at: 4200,
		node: (
			<Message
				type={'assistant'}
				parts={[
					{
						content: '11,507 views so far. 3,302 unique visitors.',
						type: 'text'
					}
				]}
			/>
		)
	}
]

export function Messages() {
	const [visible, setVisible] = useState<boolean[]>(() => Array(SCRIPT.length).fill(false))

	useEffect(() => {
		const timeouts: number[] = []
		setVisible(Array(SCRIPT.length).fill(false))
		for (let index = 0; index < SCRIPT.length; index++) {
			const entry = SCRIPT[index]
			if (!entry) continue
			const { at, hideAfter } = entry
			const showId = window.setTimeout(() => {
				setVisible(prev => {
					const next = [...prev]
					next[index] = true
					return next
				})
			}, at)
			timeouts.push(showId)
			if (typeof hideAfter === 'number') {
				const hideId = window.setTimeout(() => {
					setVisible(prev => {
						const next = [...prev]
						next[index] = false
						return next
					})
				}, at + hideAfter)
				timeouts.push(hideId)
			}
		}
		return () => {
			for (const id of timeouts) window.clearTimeout(id)
		}
	}, [])

	return (
		<div className="flex flex-col gap-4">
			{SCRIPT.map((item, index) =>
				visible[index] ? (
					<div key={index} className="contents">
						{item.node}
					</div>
				) : null
			)}
		</div>
	)
}
