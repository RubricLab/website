import {ImageResponse} from 'next/server'
import colors from 'tailwindcss/colors'
import BackgroundGrid from '~/components/BackgroundGrid.server'
import {FONTS} from '~/constants/fonts'

export const runtime = 'edge'

export const alt = 'Rubric logo with subtitle: We build software.'
export const contentType = 'image/png'
export const size = {
	height: 630,
	width: 1200
}

type Props = {
	params: object
}

export default async function Image({params}: Props) {
	console.log('Path params: ', params)

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
				<div style={{color: colors['white'], fontSize: 200}}>Rubric</div>
				<div style={{color: colors['white'], fontSize: 48}}>
					A digital studio making ai-first software.
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
