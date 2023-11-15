import {ImageResponse} from 'next/server'
import colors from 'tailwindcss/colors'
import BackgroundGrid from '../../../lib/components/BackgroundGrid.server'
import {FONTS} from '../../../lib/constants'

export const runtime = 'edge'

export const alt = 'Rubric logo with subtitle: We build software.'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

type Props = {
	params: {post: string}
}

export default async function Image({params}: Props) {
	const slug = params.post

	return new ImageResponse(
		(
			<div
				style={{
					alignItems: 'center',
					background: colors['black'],
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					justifyContent: 'center',
					overflowY: 'hidden',
					position: 'relative',
					width: '100%'
				}}>
				<BackgroundGrid
					style={{
						position: 'absolute',
						width: size.width
					}}
				/>
				<div style={{color: colors['white'], fontSize: 200}}>The Grid ${slug}</div>
				<div style={{color: colors['white'], fontSize: 48}}>
					A Newsletter by Rubric.
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{
					data: await (await fetch(FONTS.neueBit)).arrayBuffer(),
					name: 'neueBit'
				}
			]
		}
	)
}
