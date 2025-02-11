'use client'
import { useAppStore } from '@/context/use-app-store'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'styled-components'
import { navLinks, socialLinks } from '.'

const useMenu = () => {
	const menuOpen = useAppStore(s => s.menuOpen)
	const toggleMenuOpen = useAppStore(s => s.toggleMenuOpen)
	const setMenuOpen = useAppStore(s => s.setMenuOpen)
	const closeMenu = useAppStore(s => s.closeMenu)

	return {
		menuOpen,
		toggleMenuOpen,
		setMenuOpen,
		closeMenu
	}
}

export function MobileMenuToggle() {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const tl = useRef(
		gsap.timeline({
			paused: true,
			defaults: {
				duration: 0.3,
				ease: 'power3.out'
			}
		})
	)

	const { menuOpen, toggleMenuOpen } = useMenu()

	const statesMatrix = {
		initial: [
			[true, true, true],
			[false, false, false],
			[true, true, true]
		],
		closed: [
			[true, false, true],
			[false, true, false],
			[true, false, true]
		]
	}

	useGSAP(
		() => {
			const btn = buttonRef.current
			if (!btn) return

			const elements = btn.querySelectorAll('rect')
			const elementsToTurnOn = btn.querySelectorAll('rect.closed')
			gsap.set(elements, {
				transformOrigin: 'center center'
			})
			tl.current.to(elements, { opacity: 0, scale: 0.5, stagger: 0.05 }).to(elementsToTurnOn, {
				opacity: 1,
				scale: 1,
				stagger: 0.05
			})
		},
		{
			revertOnUpdate: true,
			scope: buttonRef
		}
	)

	useEffect(() => {
		menuOpen ? tl.current.play() : tl.current.reverse()
	}, [menuOpen])

	return (
		<button
			type="button"
			ref={buttonRef}
			onClick={toggleMenuOpen}
			className="col-[7/span_6] flex items-center justify-end border-border border-r border-l p-em-[12] md:hidden"
		>
			<svg className="w-em-[21]" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<title>Toggle Menu Icon</title>
				{statesMatrix.initial.map((row, rowIndex) =>
					row.map((visible, colIndex) => (
						<rect
							key={`${rowIndex}-${colIndex}`}
							x={colIndex * 5}
							y={rowIndex * 5}
							width="5"
							height="5"
							fill="currentColor"
							className={statesMatrix.closed[rowIndex]?.[colIndex] ? 'closed' : 'open'}
							opacity={visible ? 1 : 0}
						/>
					))
				)}
			</svg>
		</button>
	)
}

export function MobileMenu() {
	const { closeMenu, menuOpen } = useMenu()

	const containerRef = useRef<HTMLDivElement>(null)
	const tl = useRef(
		gsap.timeline({
			paused: true,
			defaults: {
				duration: 0.3,
				ease: 'power3.out'
			}
		})
	)

	const openTween = useRef<GSAPTween | null>(null)

	useGSAP(
		() => {
			const container = containerRef.current
			if (!container) return

			const links = gsap.utils.toArray(container.querySelectorAll('a'))

			const socialContainer = container.querySelectorAll('[data-social-link]')

			const splittedLinks = links
				.map(link => {
					const s = new SplitText(link as HTMLElement, {
						type: 'chars'
					})
					return s
				})
				.flatMap(s => s.chars)

			gsap.set(splittedLinks, {
				filter: 'blur(12px)',
				opacity: 0
			})

			tl.current
				.to(splittedLinks, {
					opacity: 1,
					filter: 'blur(0px)',
					duration: 0.35,
					stagger: 0.015
				})
				.fromTo(
					socialContainer,
					{
						'--tw-border-opacity': 0
					},
					{
						stagger: 0.1,
						duration: 0.5,
						'--tw-border-opacity': 1
					},
					'>-0.3'
				)
		},
		{
			scope: containerRef
		}
	)

	useEffect(() => {
		if (!containerRef.current) return
		// containerRef.current.style.visibility = menuOpen ? 'hidden' : 'visible'
		openTween.current?.kill()

		if (menuOpen) containerRef.current.style.visibility = 'visible'

		openTween.current = gsap.to(containerRef.current, {
			'--clip-progress': menuOpen ? 0 : 1,
			duration: 0.4,
			ease: 'power3.out',
			onComplete: () => {
				if (!containerRef.current) return
				if (!menuOpen) {
					tl.current.seek(0)
					containerRef.current.style.visibility = 'hidden'
				}
			}
		})

		menuOpen ? tl.current.play() : tl.current.reverse()
	}, [menuOpen])

	return (
		<div
			ref={containerRef}
			style={
				{
					'--clip-progress': 1,
					clipPath: 'inset(0 0 calc(var(--clip-progress) * 100%) 0)',
					pointerEvents: menuOpen ? 'auto' : 'none'
				} as CSSProperties
			}
			className="fixed top-header right-0 left-0 z-menu flex border-border border-b bg-surface px-sides md:hidden"
		>
			<div className="flex w-full flex-col border-border border-x px-sides py-em-[12]">
				<p className="text-em-[14/16] text-text-tertiary">sitemap.ts</p>

				<nav className="relative flex flex-col gap-em-[16] pt-em-[24]">
					<span
						style={{
							backgroundSize: '1px 1em',
							background: backgroundYPattern
						}}
						className="absolute top-0 bottom-em-[20] left-0 w-px"
					/>
					{navLinks.map((link, index) => (
						<div className="flex items-center gap-em-[8]" key={index}>
							<span
								className="h-px w-em-[32] bg-border"
								style={{
									backgroundSize: '1px 1em',
									background: backgroundXPattern
								}}
							/>
							<Link href={link.href} onClick={closeMenu} className="font-medium text-em-[32/16] text-text">
								{link.title}
							</Link>
						</div>
					))}
					<div className="flex items-center gap-em-[8]">
						<span
							className="h-px w-em-[54] bg-border"
							style={{
								backgroundSize: '1em 1px',
								background: backgroundXPattern
							}}
						/>
						<Link
							href={'/'}
							onClick={closeMenu}
							aria-label="Go to the Rubric Labs website"
							className="font-medium text-em-[24/16] text-text-tertiary"
						>
							Back to RubricLabs.com
						</Link>
					</div>
				</nav>

				<div className="mt-em-[48] flex w-full items-center justify-between gap-em-[8]">
					{socialLinks.map((link, index) => (
						<div data-social-link={link.title} className="border-border border-b" key={index}>
							<Link
								href={link.href}
								aria-label="Go to the Rubric Labs website"
								className="font-medium text-em-[14/16] text-text-tertiary"
							>
								{link.title}
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

const backgroundXPattern = `repeating-linear-gradient(
                                to right,
                                transparent 0px 0.5em,
                                rgb(var(--color-border) / 0.5) 0.5em 1em
                            )`

const backgroundYPattern = `repeating-linear-gradient(
								to bottom,
								transparent 0px 0.5em,
								rgb(var(--color-border) / 0.5) 0.5em 1em
							)`
