'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { useBirdsong } from './use-birdsong'

interface Particle {
	x: number
	y: number
	size: number
	speed: number
	opacity: number
	drift: number
	phase: number
}

interface LightSpot {
	x: number
	y: number
	rx: number
	ry: number
	opacity: number
	phase: number
	speed: number
	rotation: number
}

function createParticles(count: number, w: number, h: number): Particle[] {
	return Array.from({ length: count }, () => ({
		drift: (Math.random() - 0.5) * 0.3,
		opacity: 0.2 + Math.random() * 0.5,
		phase: Math.random() * Math.PI * 2,
		size: 1 + Math.random() * 3,
		speed: 0.1 + Math.random() * 0.3,
		x: Math.random() * w,
		y: Math.random() * h
	}))
}

function createLightSpots(count: number, w: number, h: number): LightSpot[] {
	return Array.from({ length: count }, () => ({
		opacity: 0.03 + Math.random() * 0.07,
		phase: Math.random() * Math.PI * 2,
		rotation: Math.random() * Math.PI,
		rx: 30 + Math.random() * 80,
		ry: 20 + Math.random() * 60,
		speed: 0.2 + Math.random() * 0.5,
		x: Math.random() * w,
		y: Math.random() * h
	}))
}

function drawSkyGradient(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	time: number,
	isDark: boolean
) {
	const breathe = Math.sin(time * 0.0003) * 0.03

	if (isDark) {
		const grad = ctx.createLinearGradient(0, 0, 0, h)
		grad.addColorStop(0, `rgba(10, 15, 40, ${1 - breathe})`)
		grad.addColorStop(0.4, `rgba(20, 25, 60, ${0.95 - breathe})`)
		grad.addColorStop(0.7, `rgba(35, 30, 50, ${0.9})`)
		grad.addColorStop(1, `rgba(50, 35, 45, ${0.85 + breathe})`)
		ctx.fillStyle = grad
	} else {
		const grad = ctx.createLinearGradient(0, 0, 0, h)
		grad.addColorStop(0, `rgba(135, 196, 240, ${0.95 - breathe})`)
		grad.addColorStop(0.3, `rgba(170, 215, 245, ${0.9 - breathe})`)
		grad.addColorStop(0.6, `rgba(220, 230, 200, ${0.85})`)
		grad.addColorStop(0.85, `rgba(250, 230, 170, ${0.8 + breathe})`)
		grad.addColorStop(1, `rgba(255, 220, 140, ${0.75 + breathe})`)
		ctx.fillStyle = grad
	}

	ctx.fillRect(0, 0, w, h)
}

function drawSunGlow(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	time: number,
	mouseX: number,
	mouseY: number,
	isDark: boolean
) {
	const sunX = w * 0.7 + mouseX * 0.05
	const sunY = h * 0.15 + mouseY * 0.03
	const pulse = Math.sin(time * 0.001) * 20

	if (isDark) {
		const moonGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 200 + pulse)
		moonGlow.addColorStop(0, 'rgba(200, 210, 255, 0.15)')
		moonGlow.addColorStop(0.3, 'rgba(150, 170, 220, 0.08)')
		moonGlow.addColorStop(1, 'rgba(100, 120, 180, 0)')
		ctx.fillStyle = moonGlow
		ctx.fillRect(0, 0, w, h)
		return
	}

	const outerGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 400 + pulse)
	outerGlow.addColorStop(0, 'rgba(255, 250, 200, 0.35)')
	outerGlow.addColorStop(0.2, 'rgba(255, 240, 170, 0.2)')
	outerGlow.addColorStop(0.5, 'rgba(255, 220, 130, 0.08)')
	outerGlow.addColorStop(1, 'rgba(255, 200, 100, 0)')
	ctx.fillStyle = outerGlow
	ctx.fillRect(0, 0, w, h)

	const innerGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 120 + pulse * 0.5)
	innerGlow.addColorStop(0, 'rgba(255, 255, 240, 0.6)')
	innerGlow.addColorStop(0.4, 'rgba(255, 248, 200, 0.3)')
	innerGlow.addColorStop(1, 'rgba(255, 240, 180, 0)')
	ctx.fillStyle = innerGlow
	ctx.fillRect(0, 0, w, h)
}

function drawLightRays(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	time: number,
	mouseX: number,
	isDark: boolean
) {
	if (isDark) return

	const originX = w * 0.7 + mouseX * 0.05
	const originY = h * 0.15
	const rayCount = 12

	ctx.save()
	ctx.globalCompositeOperation = 'screen'

	for (let i = 0; i < rayCount; i++) {
		const angle = (i / rayCount) * Math.PI * 0.8 + Math.PI * 0.3
		const sway = Math.sin(time * 0.0005 + i * 0.7) * 0.05
		const adjustedAngle = angle + sway

		const rayLength = h * 1.2
		const endX = originX + Math.cos(adjustedAngle) * rayLength
		const endY = originY + Math.sin(adjustedAngle) * rayLength

		const opacity = 0.015 + Math.sin(time * 0.0008 + i * 1.2) * 0.01
		const spread = 30 + Math.sin(time * 0.0006 + i) * 10

		const grad = ctx.createLinearGradient(originX, originY, endX, endY)
		grad.addColorStop(0, `rgba(255, 250, 200, ${opacity * 2})`)
		grad.addColorStop(0.3, `rgba(255, 240, 170, ${opacity})`)
		grad.addColorStop(1, 'rgba(255, 230, 150, 0)')

		ctx.beginPath()
		ctx.moveTo(originX, originY)

		const perpX = -Math.sin(adjustedAngle) * spread
		const perpY = Math.cos(adjustedAngle) * spread

		ctx.lineTo(endX + perpX, endY + perpY)
		ctx.lineTo(endX - perpX, endY - perpY)
		ctx.closePath()

		ctx.fillStyle = grad
		ctx.fill()
	}

	ctx.restore()
}

function drawDappledLight(
	ctx: CanvasRenderingContext2D,
	spots: LightSpot[],
	time: number,
	isDark: boolean
) {
	ctx.save()
	ctx.globalCompositeOperation = isDark ? 'screen' : 'overlay'

	for (const spot of spots) {
		const ox = Math.sin(time * 0.0004 * spot.speed + spot.phase) * 15
		const oy = Math.cos(time * 0.0003 * spot.speed + spot.phase * 1.3) * 10
		const opacityPulse =
			spot.opacity + Math.sin(time * 0.0006 * spot.speed + spot.phase) * spot.opacity * 0.5

		ctx.save()
		ctx.translate(spot.x + ox, spot.y + oy)
		ctx.rotate(spot.rotation + time * 0.0001 * spot.speed)

		const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, spot.rx)
		if (isDark) {
			grad.addColorStop(0, `rgba(180, 200, 255, ${opacityPulse * 0.5})`)
			grad.addColorStop(0.6, `rgba(120, 150, 200, ${opacityPulse * 0.3})`)
			grad.addColorStop(1, 'rgba(80, 100, 160, 0)')
		} else {
			grad.addColorStop(0, `rgba(255, 255, 240, ${opacityPulse})`)
			grad.addColorStop(0.6, `rgba(255, 250, 220, ${opacityPulse * 0.5})`)
			grad.addColorStop(1, 'rgba(255, 245, 200, 0)')
		}

		ctx.fillStyle = grad
		ctx.beginPath()
		ctx.ellipse(0, 0, spot.rx, spot.ry, 0, 0, Math.PI * 2)
		ctx.fill()
		ctx.restore()
	}

	ctx.restore()
}

function drawFloatingParticles(
	ctx: CanvasRenderingContext2D,
	particles: Particle[],
	time: number,
	w: number,
	h: number,
	isDark: boolean
) {
	for (const p of particles) {
		p.y -= p.speed
		p.x += p.drift + Math.sin(time * 0.001 + p.phase) * 0.2

		if (p.y < -10) {
			p.y = h + 10
			p.x = Math.random() * w
		}
		if (p.x < -10) p.x = w + 10
		if (p.x > w + 10) p.x = -10

		const twinkle = 0.5 + Math.sin(time * 0.003 + p.phase) * 0.5
		const alpha = p.opacity * twinkle

		const color = isDark ? `rgba(200, 220, 255, ${alpha})` : `rgba(255, 250, 230, ${alpha})`

		ctx.beginPath()
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
		ctx.fillStyle = color
		ctx.fill()
	}
}

function drawLeafShadows(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	time: number,
	isDark: boolean
) {
	ctx.save()
	ctx.globalCompositeOperation = 'multiply'

	const shadowCount = 8
	for (let i = 0; i < shadowCount; i++) {
		const baseX = (w / shadowCount) * i + w / shadowCount / 2
		const baseY = h * 0.1 + (i % 3) * h * 0.05

		const sway = Math.sin(time * 0.0003 + i * 1.5) * 20
		const x = baseX + sway
		const y = baseY + Math.cos(time * 0.0002 + i * 2) * 5

		const shadowH = h * 0.8
		const shadowW = 40 + Math.sin(time * 0.0004 + i) * 15

		const grad = ctx.createLinearGradient(x, y, x, y + shadowH)
		if (isDark) {
			grad.addColorStop(0, `rgba(0, 0, 20, ${0.08 + Math.sin(time * 0.0005 + i) * 0.03})`)
			grad.addColorStop(0.5, `rgba(0, 0, 15, ${0.04})`)
			grad.addColorStop(1, 'rgba(0, 0, 10, 0)')
		} else {
			grad.addColorStop(0, `rgba(60, 80, 40, ${0.08 + Math.sin(time * 0.0005 + i) * 0.03})`)
			grad.addColorStop(0.5, `rgba(40, 60, 30, ${0.04})`)
			grad.addColorStop(1, 'rgba(30, 50, 20, 0)')
		}

		ctx.fillStyle = grad
		ctx.beginPath()
		ctx.ellipse(x, y + shadowH / 2, shadowW, shadowH / 2, 0, 0, Math.PI * 2)
		ctx.fill()
	}

	ctx.restore()
}

export function SunnyDayCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const frameRef = useRef<number>(0)
	const mouseRef = useRef({ x: 0, y: 0 })
	const particlesRef = useRef<Particle[]>([])
	const spotsRef = useRef<LightSpot[]>([])
	const [audioActive, setAudioActive] = useState(false)
	const [isDark, setIsDark] = useState(false)
	const birdsong = useBirdsong()

	useEffect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		setIsDark(mq.matches)
		const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	const handleToggleAudio = useCallback(() => {
		const isNowPlaying = birdsong.toggle()
		setAudioActive(isNowPlaying)
	}, [birdsong])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const resize = () => {
			const dpr = window.devicePixelRatio || 1
			canvas.width = window.innerWidth * dpr
			canvas.height = window.innerHeight * dpr
			canvas.style.width = `${window.innerWidth}px`
			canvas.style.height = `${window.innerHeight}px`
			ctx.scale(dpr, dpr)

			const w = window.innerWidth
			const h = window.innerHeight
			particlesRef.current = createParticles(60, w, h)
			spotsRef.current = createLightSpots(15, w, h)
		}

		resize()
		window.addEventListener('resize', resize)

		const handleMouse = (e: MouseEvent) => {
			mouseRef.current = {
				x: (e.clientX / window.innerWidth - 0.5) * 2,
				y: (e.clientY / window.innerHeight - 0.5) * 2
			}
		}
		window.addEventListener('mousemove', handleMouse)

		const animate = (time: number) => {
			const w = window.innerWidth
			const h = window.innerHeight
			const { x: mx, y: my } = mouseRef.current

			ctx.clearRect(0, 0, w, h)

			drawSkyGradient(ctx, w, h, time, isDark)
			drawSunGlow(ctx, w, h, time, mx, my, isDark)
			drawLightRays(ctx, w, h, time, mx, isDark)
			drawLeafShadows(ctx, w, h, time, isDark)
			drawDappledLight(ctx, spotsRef.current, time, isDark)
			drawFloatingParticles(ctx, particlesRef.current, time, w, h, isDark)

			frameRef.current = requestAnimationFrame(animate)
		}

		frameRef.current = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(frameRef.current)
			window.removeEventListener('resize', resize)
			window.removeEventListener('mousemove', handleMouse)
		}
	}, [isDark])

	useEffect(() => {
		return () => {
			birdsong.stop()
		}
	}, [birdsong])

	return (
		<div className="fixed inset-0 -z-10">
			<canvas ref={canvasRef} className="absolute inset-0" />

			<button
				type="button"
				onClick={handleToggleAudio}
				className={cn(
					'fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm transition-all',
					audioActive
						? 'border-amber-400/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
						: 'border-white/20 bg-white/10 text-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white/50'
				)}
			>
				<span className="text-base">{audioActive ? '🐦' : '🔇'}</span>
				<span>{audioActive ? 'Birdsong on' : 'Enable birdsong'}</span>
			</button>
		</div>
	)
}
