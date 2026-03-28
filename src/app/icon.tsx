import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'
export const size = {
	height: 32,
	width: 32
}

export default async function Icon() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'center',
				background: '#0A0A0A',
				color: '#EDEDED',
				display: 'flex',
				fontFamily: 'monospace',
				fontSize: 22,
				fontWeight: 500,
				height: '100%',
				justifyContent: 'center',
				letterSpacing: '0.05em',
				width: '100%'
			}}
		>
			R
		</div>,
		{ ...size }
	)
}
