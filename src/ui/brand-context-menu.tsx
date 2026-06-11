'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
	BRAND_ASSET_LABELS,
	type BrandAssetFormat,
	type BrandAssetKind,
	copyBrandAsset,
	downloadBrandAsset,
	themeBrandAssetVariant
} from '~/lib/utils/brand-assets'
import { Chevron } from '~/ui/icons/chevron'

const kinds: BrandAssetKind[] = ['logo', 'wordmark']

const actions: {
	label: string
	action: 'copy' | 'download'
	format: BrandAssetFormat
}[] = [
	{ action: 'copy', format: 'svg', label: 'Copy as SVG' },
	{ action: 'copy', format: 'png', label: 'Copy as PNG' },
	{ action: 'download', format: 'svg', label: 'Download SVG' },
	{ action: 'download', format: 'png', label: 'Download PNG' }
]

const itemClassName =
	'flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-1.5 text-left text-secondary text-sm transition-colors hover:bg-subtle hover:text-primary focus:outline-none'

/**
 * Right-clicking the children opens a menu to copy or download the Rubric
 * logo or wordmark as SVG or PNG, matching the user's color scheme.
 */
export const BrandContextMenu = ({ children }: { children: React.ReactNode }) => {
	const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!position) return

		const close = () => setPosition(null)
		const onPointerDown = (event: PointerEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) close()
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close()
		}

		window.addEventListener('pointerdown', onPointerDown)
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('scroll', close)
		window.addEventListener('resize', close)
		return () => {
			window.removeEventListener('pointerdown', onPointerDown)
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('scroll', close)
			window.removeEventListener('resize', close)
		}
	}, [position])

	const run = async (kind: BrandAssetKind, { action, format }: (typeof actions)[number]) => {
		setPosition(null)
		const variant = themeBrandAssetVariant()
		try {
			if (action === 'copy') {
				await copyBrandAsset(kind, variant, format)
				toast.success(`${BRAND_ASSET_LABELS[kind]} copied as ${format.toUpperCase()}`)
			} else downloadBrandAsset(kind, variant, format)
		} catch {
			toast.error('Could not access clipboard')
		}
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: contextmenu only augments the interactive child link
		<span
			className="contents"
			onContextMenu={event => {
				event.preventDefault()
				setPosition({
					x: Math.min(event.clientX, window.innerWidth - 360),
					y: Math.min(event.clientY, window.innerHeight - 160)
				})
			}}
		>
			{children}
			{position && (
				<div
					ref={menuRef}
					className="fixed z-50 w-44 animate-fadeIn rounded-xl border border-subtle bg-background p-1.5 shadow-lg"
					style={{ left: position.x, top: position.y }}
				>
					{kinds.map(kind => (
						<div key={kind} className="group/sub relative">
							<button type="button" className={itemClassName}>
								{BRAND_ASSET_LABELS[kind]}
								<Chevron className="size-4 -rotate-90" />
							</button>
							<div className="invisible absolute top-0 left-full pl-1 opacity-0 transition-opacity group-hover/sub:visible group-hover/sub:opacity-100">
								<div className="w-44 rounded-xl border border-subtle bg-background p-1.5 shadow-lg">
									{actions.map(action => (
										<button
											key={action.label}
											type="button"
											className={itemClassName}
											onClick={() => run(kind, action)}
										>
											{action.label}
										</button>
									))}
								</div>
							</div>
						</div>
					))}
					<div className="my-1.5 border-subtle border-t" />
					<Link href="/brand" className={itemClassName} onClick={() => setPosition(null)}>
						Brand guidelines
					</Link>
				</div>
			)}
		</span>
	)
}
