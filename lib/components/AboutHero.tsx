'use client'
import {useEffect, useState} from 'react'
import Game from './game'

export default function AboutHero() {
	const [start, setStart] = useState(false)

	useEffect(() => {
		setTimeout(() => setStart(true), 1 * 1000)
	}, [])

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-5 p-8'>
			<Game
				running={start}
				setRunning={setStart}
			/>
		</div>
	)
}
