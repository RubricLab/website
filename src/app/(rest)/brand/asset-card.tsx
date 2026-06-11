'use client'

import { toast } from 'sonner'
import {
	BRAND_ASSET_LABELS,
	type BrandAssetFormat,
	type BrandAssetKind,
	type BrandAssetVariant,
	brandAssetPath,
	copyBrandAsset,
	downloadBrandAsset
} from '~/lib/utils/brand-assets'
import { Button } from '~/ui/button'

export const AssetCard = ({
	kind,
	variant
}: {
	kind: BrandAssetKind
	variant: BrandAssetVariant
}) => {
	const label = BRAND_ASSET_LABELS[kind]

	const handleCopy = async (format: BrandAssetFormat) => {
		try {
			await copyBrandAsset(kind, variant, format)
			toast.success(`${label} copied as ${format.toUpperCase()}`)
		} catch {
			toast.error('Could not access clipboard')
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<img
				src={brandAssetPath(kind, variant, 'svg')}
				alt={`Rubric ${kind} (${variant})`}
				className="w-full border border-subtle"
			/>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-secondary text-sm capitalize">
					{label} · {variant}
				</p>
				<div className="flex items-center gap-1">
					{(['svg', 'png'] as const).map(format => (
						<Button
							key={format}
							variant="link"
							size="sm"
							className="uppercase"
							onClick={() => handleCopy(format)}
						>
							Copy {format}
						</Button>
					))}
					{(['svg', 'png'] as const).map(format => (
						<Button
							key={format}
							variant="outline"
							size="sm"
							className="uppercase"
							onClick={() => downloadBrandAsset(kind, variant, format)}
						>
							{format} ↓
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}
