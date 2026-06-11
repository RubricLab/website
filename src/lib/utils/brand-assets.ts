export type BrandAssetKind = 'logo' | 'wordmark'
export type BrandAssetFormat = 'svg' | 'png'
export type BrandAssetVariant = 'black' | 'white'

export const BRAND_ASSET_LABELS: Record<BrandAssetKind, string> = {
	logo: 'Logo',
	wordmark: 'Wordmark'
}

export const brandAssetPath = (
	kind: BrandAssetKind,
	variant: BrandAssetVariant,
	format: BrandAssetFormat
) => `/brand/${kind}-${variant}.${format}`

/** The variant matching the user's current color scheme (white mark on black in dark mode). */
export const themeBrandAssetVariant = (): BrandAssetVariant =>
	window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'white' : 'black'

export const copyBrandAsset = async (
	kind: BrandAssetKind,
	variant: BrandAssetVariant,
	format: BrandAssetFormat
) => {
	const path = brandAssetPath(kind, variant, format)

	if (format === 'svg') {
		const markup = await fetch(path).then(res => res.text())
		await navigator.clipboard.writeText(markup)
		return
	}

	// Pass a promise so the write stays within the user gesture (required by Safari)
	const blob = fetch(path).then(res => res.blob())
	await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

export const downloadBrandAsset = (
	kind: BrandAssetKind,
	variant: BrandAssetVariant,
	format: BrandAssetFormat
) => {
	const anchor = document.createElement('a')
	anchor.href = brandAssetPath(kind, variant, format)
	anchor.download = `rubric-${kind}-${variant}.${format}`
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
}
