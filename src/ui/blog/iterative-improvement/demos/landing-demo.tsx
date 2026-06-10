'use client'

import { createContext, type ReactNode, type SyntheticEvent, useContext, useRef } from 'react'
import { DemoSection } from './demo-row'

// Shows the three landing-page iterations side by side. Each iteration is the
// exact self-contained HTML artifact, iframed at a mobile viewport so readers
// see the real page and can scroll it. The frames scroll in tandem: the pages
// differ in length, so we sync by scroll fraction rather than pixels.
export const LandingDemoSection = ({ bare = false }: { bare?: boolean }) => {
	return (
		<SyncScrollProvider>
			<DemoSection
				bare={bare}
				id="landing"
				title="1 · The purple-hell landing page"
				blurb="The one-shot baseline, a mid de-slop pass, and the final polished page. Scroll one frame — the others follow."
				columns={[
					{
						body: (
							<IterationFrame
								src="/iterative-improvement/landing/iter-0.html"
								title="Landing page — iteration 0 (one-shot)"
							/>
						),
						caption: 'one-shot',
						label: 'Iteration 1 (one-shot)'
					},
					{
						body: (
							<IterationFrame
								src="/iterative-improvement/landing/iter-2.html"
								title="Landing page — iteration 2 (de-slopped)"
							/>
						),
						caption: 'de-slopped',
						label: 'Iteration 2'
					},
					{
						body: (
							<IterationFrame
								src="/iterative-improvement/landing/iter-3.html"
								title="Landing page — iteration 3 (polished)"
							/>
						),
						caption: 'polished',
						label: 'Iteration 3'
					}
				]}
			/>
		</SyncScrollProvider>
	)
}

// One scroll group per demo instance. `source` locks syncing to the frame the
// reader is actually scrolling, so the programmatic scrolls we apply to the
// other frames don't echo back and fight it.
type SyncGroup = {
	windows: Set<Window>
	source: Window | null
	timer: number
}

const SyncScrollContext = createContext<SyncGroup | null>(null)

const SyncScrollProvider = ({ children }: { children: ReactNode }) => {
	const group = useRef<SyncGroup>({ source: null, timer: 0, windows: new Set() })
	return <SyncScrollContext.Provider value={group.current}>{children}</SyncScrollContext.Provider>
}

const syncFrom = (group: SyncGroup, win: Window) => {
	if (group.source && group.source !== win) return
	group.source = win
	window.clearTimeout(group.timer)
	group.timer = window.setTimeout(() => {
		group.source = null
	}, 150)

	const doc = win.document.scrollingElement ?? win.document.documentElement
	const max = doc.scrollHeight - doc.clientHeight
	const fraction = max > 0 ? win.scrollY / max : 0

	for (const other of group.windows) {
		if (other === win) continue
		const otherDoc = other.document.scrollingElement ?? other.document.documentElement
		other.scrollTo(0, fraction * (otherDoc.scrollHeight - otherDoc.clientHeight))
	}
}

const IterationFrame = ({ src, title }: { src: string; title: string }) => {
	const group = useContext(SyncScrollContext)

	// The artifacts are same-origin static HTML, so we can hook each frame's
	// window directly once it loads. The listener dies with the iframe's
	// window on unmount/navigation, so only registry cleanup is needed.
	const handleLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
		const win = event.currentTarget.contentWindow
		if (!win || !group) return
		group.windows.add(win)
		win.addEventListener('scroll', () => syncFrom(group, win), { passive: true })
	}

	return (
		<iframe
			src={src}
			title={title}
			loading="lazy"
			onLoad={handleLoad}
			className="h-[560px] w-full rounded-lg border border-subtle bg-white"
		/>
	)
}
