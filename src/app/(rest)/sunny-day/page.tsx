import type { Metadata } from 'next/types'
import { SunnyDayScene } from '~/ui/sunny-day/sunny-day-scene'

export const metadata: Metadata = {
	description:
		'An ambient, interactive experience with warm sunlight and birdsong. Move your mouse to shift the light.',
	title: 'Sunny Day — Rubric Labs'
}

export default function SunnyDayPage() {
	return <SunnyDayScene />
}
