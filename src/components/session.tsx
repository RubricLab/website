'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const USER_MESSAGE = "We're building an e-commerce AI agent for our catalog of 50k products. Can Rubric handle this?"

const REASONING_LINES = [
	'Evaluating project fit against Rubric\'s capabilities.',
	'Core requirements: product recommendation agent, cart management, personalized deals engine. ~50K SKU catalog.',
	'This maps directly to our Safeway AI architecture — same pattern: large catalog search, preference-based personalization, tool-based cart management, generative UI.',
	'Checking case studies for relevant prior work...'
]

const TOOLS = [
	{ name: 'search_case_studies', time: '120ms' },
	{ name: 'check_capabilities', time: '45ms' },
	{ name: 'estimate_timeline', time: '90ms' },
	{ name: 'assess_fit', time: '180ms' }
]

const FIT_DATA = [
	{ label: 'Context Engineering', value: 92 },
	{ label: 'Catalog & Retrieval', value: 96 },
	{ label: 'Generative UI', value: 94 },
	{ label: 'Personalization', value: 97 },
	{ label: 'Production Readiness', value: 93 }
]

const TIMELINE = [
	{ week: 'Week 1–2', task: 'Architecture + context engineering' },
	{ week: 'Week 3–4', task: 'Core agent + tool layer + memory system' },
	{ week: 'Week 5', task: 'Generative UI + integration' },
	{ week: 'Week 6', task: 'Production hardening + contract verification' }
]

// Animation phases
type Phase = 'empty' | 'typing' | 'sent' | 'thinking' | 'tools' | 'ui' | 'complete'

function BlinkingCursor() {
	return <span className="inline-block w-[1px] h-[14px] bg-[#888888] animate-blink ml-1 align-middle" />
}

function useTypingAnimation(text: string, startDelay: number, speed = 35) {
	const [displayed, setDisplayed] = useState('')
	const [done, setDone] = useState(false)
	const rafRef = useRef<number>(0)

	useEffect(() => {
		let cancelled = false
		const startTime = performance.now() + startDelay

		const tick = () => {
			if (cancelled) return
			const elapsed = performance.now() - startTime
			if (elapsed < 0) {
				rafRef.current = requestAnimationFrame(tick)
				return
			}
			const chars = Math.min(Math.floor(elapsed / speed), text.length)
			setDisplayed(text.slice(0, chars))
			if (chars >= text.length) {
				setDone(true)
				return
			}
			rafRef.current = requestAnimationFrame(tick)
		}

		rafRef.current = requestAnimationFrame(tick)
		return () => {
			cancelled = true
			cancelAnimationFrame(rafRef.current)
		}
	}, [text, startDelay, speed])

	return { displayed, done }
}

export function Session() {
	const [phase, setPhase] = useState<Phase>('empty')
	const [visibleReasoningLines, setVisibleReasoningLines] = useState(0)
	const [visibleTools, setVisibleTools] = useState(0)
	const [showFit, setShowFit] = useState(false)
	const [showCaseStudy, setShowCaseStudy] = useState(false)
	const [showTimeline, setShowTimeline] = useState(false)
	const [showMemory, setShowMemory] = useState(false)
	const [input, setInput] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	// Typing animation for user message
	const { displayed: typedMessage, done: typingDone } = useTypingAnimation(
		USER_MESSAGE,
		1200, // start after 1.2s
		30
	)

	// Phase transitions
	useEffect(() => {
		// Start typing after initial delay
		const t1 = setTimeout(() => setPhase('typing'), 1000)
		return () => clearTimeout(t1)
	}, [])

	useEffect(() => {
		if (typingDone && phase === 'typing') {
			// Brief pause after typing, then "send"
			const t = setTimeout(() => setPhase('sent'), 400)
			return () => clearTimeout(t)
		}
	}, [typingDone, phase])

	useEffect(() => {
		if (phase === 'sent') {
			// Show thinking after a beat
			const t = setTimeout(() => setPhase('thinking'), 600)
			return () => clearTimeout(t)
		}
	}, [phase])

	// Reasoning lines appear one by one
	useEffect(() => {
		if (phase === 'thinking') {
			let i = 0
			const interval = setInterval(() => {
				i++
				setVisibleReasoningLines(i)
				if (i >= REASONING_LINES.length) {
					clearInterval(interval)
					setTimeout(() => setPhase('tools'), 500)
				}
			}, 600)
			return () => clearInterval(interval)
		}
	}, [phase])

	// Tools appear one by one
	useEffect(() => {
		if (phase === 'tools') {
			let i = 0
			const interval = setInterval(() => {
				i++
				setVisibleTools(i)
				if (i >= TOOLS.length) {
					clearInterval(interval)
					setTimeout(() => setPhase('ui'), 400)
				}
			}, 250)
			return () => clearInterval(interval)
		}
	}, [phase])

	// Generative UI components appear sequentially
	useEffect(() => {
		if (phase === 'ui') {
			const t1 = setTimeout(() => setShowFit(true), 200)
			const t2 = setTimeout(() => setShowCaseStudy(true), 800)
			const t3 = setTimeout(() => setShowTimeline(true), 1400)
			const t4 = setTimeout(() => {
				setShowMemory(true)
				setPhase('complete')
			}, 2000)
			return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
		}
	}, [phase])

	const handleSend = useCallback(() => {
		if (!input.trim()) return
		setInput('')
	}, [input])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const showUserMessage = phase !== 'empty'
	const showAssistant = phase === 'thinking' || phase === 'tools' || phase === 'ui' || phase === 'complete'

	return (
		<section className="relative min-h-screen flex items-center" id="session-section">
			<div className="max-w-[1200px] mx-auto px-6 md:px-8 w-full py-24 md:py-0">
				<div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">

					{/* Left: Headline */}
					<div className="md:w-[35%] shrink-0 md:sticky md:top-[40%] md:-translate-y-1/2">
						<h1 className="font-sans text-[clamp(36px,5vw,64px)] text-[#EDEDED] font-normal leading-[1.1] tracking-tight">
							A lab that ships.
						</h1>
						<p className="mt-5 font-sans text-base md:text-lg text-[#888888] leading-relaxed max-w-[400px]">
							We study how AI agents should be built — then we build them. For ourselves and for the companies that hire us.
						</p>
						<a
							href="/work"
							className="inline-flex items-center gap-2 mt-8 font-mono text-[13px] text-[#555555] hover:text-[#EDEDED] transition-colors duration-200"
						>
							See the work <span>→</span>
						</a>
					</div>

					{/* Right: Chat Interface */}
					<div className="md:w-[65%] min-w-0">
						<div className="bg-[#111111] border border-[#1A1A1A] rounded-lg overflow-hidden">
							{/* Header */}
							<div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-[#1A1A1A]">
								<span className="font-mono text-[10px] md:text-xs text-[#555555] tracking-widest uppercase">
									Rubric Assistant
								</span>
								<span className="relative flex h-[6px] w-[6px]">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-50" />
									<span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#4ADE80]" />
								</span>
							</div>

							{/* Conversation — scrollable, max height */}
							<div className="p-4 md:p-5 space-y-6 overflow-y-auto max-h-[60vh] min-h-[300px]">
								{/* User message */}
								{showUserMessage && (
									<div className="flex flex-col gap-1 animate-fadeIn">
										<span className="font-mono text-[10px] text-[#555555] tracking-widest uppercase">You</span>
										<p className="font-sans text-sm md:text-[15px] text-[#EDEDED] leading-relaxed">
											{phase === 'typing' ? (
												<>{typedMessage}<BlinkingCursor /></>
											) : (
												USER_MESSAGE
											)}
										</p>
									</div>
								)}

								{/* Assistant response */}
								{showAssistant && (
									<div className="flex flex-col gap-1 animate-fadeIn">
										<span className="font-mono text-[10px] text-[#555555] tracking-widest uppercase">Rubric</span>
										<div className="space-y-4">
											{/* Reasoning trace */}
											<div data-explode="reasoning" className="border-l-2 border-[#1A1A1A] pl-3 py-1">
												<span className="font-mono text-[10px] text-[#555555] tracking-widest uppercase block mb-2">
													Thinking
												</span>
												<div className="font-mono text-[11px] md:text-[12px] text-[#888888] leading-relaxed space-y-1.5">
													{REASONING_LINES.slice(0, visibleReasoningLines).map((line) => (
														<p key={line} className="animate-fadeIn">{line}</p>
													))}
												</div>
												{phase === 'thinking' && <BlinkingCursor />}
											</div>

											{/* Tool calls */}
											{visibleTools > 0 && (
												<div data-explode="tools" className="flex flex-wrap gap-1.5">
													{TOOLS.slice(0, visibleTools).map(tool => (
														<div key={tool.name} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded px-2 py-1.5 animate-fadeIn">
															<div className="font-mono text-[11px] text-[#EDEDED]">{tool.name}</div>
															<div className="font-mono text-[10px] text-[#555555] mt-0.5">{tool.time} ✓</div>
														</div>
													))}
												</div>
											)}

											{/* Generative UI */}
											{(showFit || showCaseStudy || showTimeline) && (
												<div data-explode="generative-ui" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3 md:p-4 space-y-4">
													{/* Fit bars */}
													{showFit && (
														<div className="animate-fadeIn">
															<div className="font-mono text-[10px] text-[#555555] tracking-widest uppercase mb-3">Project Fit</div>
															<div className="space-y-2">
																{FIT_DATA.map(item => (
																	<div key={item.label} className="flex items-center gap-2">
																		<span className="font-mono text-[10px] md:text-[11px] text-[#888888] w-[100px] md:w-[140px] shrink-0 truncate">{item.label}</span>
																		<div className="flex-1 h-[2px] bg-[#1A1A1A] rounded-full overflow-hidden">
																			<div className="h-full bg-[#EDEDED] rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.value}%` }} />
																		</div>
																		<span className="font-mono text-[10px] text-[#555555] w-[30px] text-right">{item.value}%</span>
																	</div>
																))}
															</div>
														</div>
													)}

													{/* Case study */}
													{showCaseStudy && (
														<div className="border border-[#1A1A1A] rounded p-3 animate-fadeIn">
															<div className="font-mono text-[10px] text-[#555555] tracking-widest uppercase mb-1.5">Relevant Work</div>
															<div className="font-sans text-sm text-[#EDEDED]">Safeway AI</div>
															<div className="font-mono text-[10px] text-[#888888] mt-0.5">Albertsons · Fortune 500 · Production</div>
															<p className="font-sans text-[12px] text-[#888888] mt-2 leading-relaxed">
																AI grocery agent with bespoke memory system and household preference mapping. 50K+ SKU catalog search.
															</p>
															<div className="font-mono text-[10px] text-[#555555] mt-2">Memory · Agents · Generative UI · Personalization</div>
														</div>
													)}

													{/* Timeline */}
													{showTimeline && (
														<div className="animate-fadeIn">
															<div className="font-mono text-[10px] text-[#555555] tracking-widest uppercase mb-2">Estimated Timeline</div>
															<div className="space-y-1">
																{TIMELINE.map(row => (
																	<div key={row.week} className="flex gap-3">
																		<span className="font-mono text-[10px] md:text-[11px] text-[#555555] w-[60px] shrink-0">{row.week}</span>
																		<span className="font-sans text-[12px] text-[#888888]">{row.task}</span>
																	</div>
																))}
															</div>
															<div className="font-mono text-[11px] text-[#4ADE80] mt-3">
																6 weeks · High confidence based on prior work
															</div>
														</div>
													)}
												</div>
											)}

											{/* Memory badge */}
											{showMemory && (
												<div data-explode="memory" className="flex items-center gap-2 animate-fadeIn">
													<span className="font-mono text-[11px] text-[#888888]">↻</span>
													<span className="font-mono text-[10px] text-[#555555]">
														Logged: e-commerce inquiry · 50K SKUs · personalization + memory + gen UI
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Input */}
							<div className="flex items-center gap-3 px-4 md:px-5 py-3 border-t border-[#1A1A1A]">
								<input
									ref={inputRef}
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									placeholder="Ask Rubric something..."
									className="flex-1 bg-transparent font-sans text-sm text-[#EDEDED] placeholder:text-[#555555] outline-none"
								/>
								<button
									type="button"
									onClick={handleSend}
									className={`text-[#555555] hover:text-[#EDEDED] transition-all duration-150 ${input || isFocused ? 'opacity-100' : 'opacity-0'}`}
								>
									<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
										<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</button>
							</div>
						</div>

						{/* Scroll prompt */}
						{phase === 'complete' && (
							<div className="text-center mt-6 animate-fadeIn">
								<p className="font-mono text-xs text-[#555555]">↓ Scroll to see how we build</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
