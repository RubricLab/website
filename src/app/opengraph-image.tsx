import { ImageResponse } from 'next/og'
import { getBaseUrl } from '~/lib/utils'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'edge'
export const alt = 'Applied AI lab helping companies build intelligent applications'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

export type ImageProps = {
	params: object
}

export const Component = () => {
	return (
		<div
			style={{
				alignItems: 'center',
				color: 'white',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				position: 'relative',
				width: '100%'
			}}
		>
			<div
				style={{
					display: 'flex',
					height: '100%',
					left: 0,
					position: 'absolute',
					top: 0,
					width: '100%'
				}}
			>
				{/** biome-ignore lint/performance/noImgElement: techdebt */}
				<img src={`${getBaseUrl()}/images/seedling.png`} alt="Rubric Labs" width="100%" height="auto" />
			</div>
			<Rubric style={{ height: 56, marginBottom: 24, width: 56 }} />
			<div style={{ fontSize: 48 }}>Applied AI</div>
		</div>
	)
}

export default async function Response(_: ImageProps) {
	const baseUrl = getBaseUrl()
	
	// Fetch font with error handling
	let localFont: ArrayBuffer
	try {
		localFont = await fetch(`${baseUrl}/fonts/matter-regular.woff`).then(res => {
			if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`)
			return res.arrayBuffer()
		})
	} catch (error) {
		console.error('Failed to load font for OG image:', error)
		// Return image without custom font if fetch fails
		return new ImageResponse(<Component />, { ...size })
	}

	return new ImageResponse(<Component />, {
		...size,
		fonts: [
			{
				data: localFont,
				name: 'Matter',
				style: 'normal',
				weight: 400
			}
		]
	})
}
