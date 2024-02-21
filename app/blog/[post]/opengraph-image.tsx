import {ImageResponse} from 'next/og'
import colors from 'tailwindcss/colors'
import {FONTS} from '~/constants/fonts'
import {getPost} from '~/sanity/utils'

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
	console.log('Path params: ', params)
	const post = await getPost(params.post)

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
				<img
					src={post.mainImage}
					style={{
						zIndex: -1,
						position: 'absolute',
						width: '100%',
						height: '100%',
						opacity: 0.5
					}}
				/>
				<div style={{color: colors['white'], fontSize: 100, textAlign: 'center'}}>
					{post.title}
				</div>

				<div
					style={{
						position: 'absolute',
						left: '20px',
						bottom: '20px',
						color: colors['white'],
						fontSize: 48
					}}>
					Rubric Blog
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
