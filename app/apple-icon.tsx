import {ImageResponse} from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'
export const size = {
	height: 32,
	width: 32
}

export default async function Icon() {
	return new ImageResponse(
		(
			<svg
				width='32'
				height='32'
				viewBox='0 0 32 32'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<g clipPath='url(#frame)'>
					<rect
						width='32'
						height='32'
						fill='black'
					/>
					<rect
						x='4'
						y='20'
						width='8'
						height='8'
						fill='white'
					/>
					<rect
						x='4'
						y='12'
						width='8'
						height='8'
						fill='white'
					/>
					<rect
						x='4'
						y='4'
						width='8'
						height='8'
						fill='white'
					/>
					<rect
						x='12'
						y='12'
						width='8'
						height='8'
						fill='white'
					/>
					<rect
						x='20'
						y='4'
						width='8'
						height='8'
						fill='white'
					/>
				</g>
				<defs>
					<clipPath id='frame'>
						<rect
							width='32'
							height='32'
							fill='white'
						/>
					</clipPath>
				</defs>
			</svg>
		),
		{...size}
	)
}
