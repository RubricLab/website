import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rubric — A lab that ships.'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'center',
				background: '#0A0A0A',
				color: '#EDEDED',
				display: 'flex',
				fontFamily: 'monospace',
				fontSize: 64,
				fontWeight: 500,
				height: '100%',
				justifyContent: 'center',
				letterSpacing: '0.15em',
				width: '100%'
			}}
		>
			RUBRIC
		</div>,
		{ ...size }
	)
}
