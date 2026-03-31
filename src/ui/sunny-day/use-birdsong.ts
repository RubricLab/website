'use client'

import { useCallback, useRef } from 'react'

interface BirdVoice {
	baseFreq: number
	freqRange: number
	duration: number
	interval: number
	chirps: number
	volume: number
}

const BIRD_VOICES: BirdVoice[] = [
	{ baseFreq: 2800, chirps: 4, duration: 0.08, freqRange: 600, interval: 0.12, volume: 0.06 },
	{ baseFreq: 3500, chirps: 6, duration: 0.06, freqRange: 800, interval: 0.09, volume: 0.04 },
	{ baseFreq: 2200, chirps: 3, duration: 0.12, freqRange: 400, interval: 0.18, volume: 0.05 },
	{ baseFreq: 4200, chirps: 8, duration: 0.04, freqRange: 1000, interval: 0.07, volume: 0.03 },
	{ baseFreq: 1800, chirps: 2, duration: 0.15, freqRange: 300, interval: 0.25, volume: 0.05 },
	{ baseFreq: 3000, chirps: 5, duration: 0.1, freqRange: 500, interval: 0.14, volume: 0.04 }
]

function scheduleChirpSequence(
	ctx: AudioContext,
	voice: BirdVoice,
	startTime: number,
	pan: number
) {
	for (let i = 0; i < voice.chirps; i++) {
		const t = startTime + i * voice.interval
		const freq = voice.baseFreq + (Math.random() - 0.5) * voice.freqRange
		const freqEnd = freq + (Math.random() - 0.3) * voice.freqRange * 0.5

		const osc = ctx.createOscillator()
		const gain = ctx.createGain()
		const panner = ctx.createStereoPanner()

		osc.type = 'sine'
		osc.frequency.setValueAtTime(freq, t)
		osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 200), t + voice.duration)

		gain.gain.setValueAtTime(0, t)
		gain.gain.linearRampToValueAtTime(voice.volume, t + voice.duration * 0.15)
		gain.gain.setValueAtTime(voice.volume, t + voice.duration * 0.6)
		gain.gain.exponentialRampToValueAtTime(0.001, t + voice.duration)

		panner.pan.setValueAtTime(pan + (Math.random() - 0.5) * 0.3, t)

		osc.connect(gain)
		gain.connect(panner)
		panner.connect(ctx.destination)

		osc.start(t)
		osc.stop(t + voice.duration + 0.01)
	}
}

function scheduleBirdCycle(ctx: AudioContext) {
	const now = ctx.currentTime
	const cycleLength = 8 + Math.random() * 12

	const birdsThisCycle = 2 + Math.floor(Math.random() * 3)
	for (let b = 0; b < birdsThisCycle; b++) {
		const voice = BIRD_VOICES[Math.floor(Math.random() * BIRD_VOICES.length)] as BirdVoice
		const offset = Math.random() * cycleLength * 0.6
		const pan = (Math.random() - 0.5) * 1.8
		scheduleChirpSequence(ctx, voice, now + offset, pan)
	}

	return cycleLength
}

export function useBirdsong() {
	const ctxRef = useRef<AudioContext | null>(null)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const activeRef = useRef(false)

	const loop = useCallback(() => {
		if (!ctxRef.current || !activeRef.current) return
		const next = scheduleBirdCycle(ctxRef.current)
		timerRef.current = setTimeout(loop, next * 1000 * 0.7)
	}, [])

	const start = useCallback(() => {
		if (activeRef.current) return
		const ctx = new AudioContext()
		ctxRef.current = ctx
		activeRef.current = true
		loop()
	}, [loop])

	const stop = useCallback(() => {
		activeRef.current = false
		if (timerRef.current) {
			clearTimeout(timerRef.current)
			timerRef.current = null
		}
		if (ctxRef.current) {
			ctxRef.current.close()
			ctxRef.current = null
		}
	}, [])

	const toggle = useCallback(() => {
		if (activeRef.current) {
			stop()
			return false
		}
		start()
		return true
	}, [start, stop])

	return { start, stop, toggle }
}
