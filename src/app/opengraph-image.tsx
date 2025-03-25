import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'

export const runtime = 'edge'
export const alt = 'Rubric website'
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
				background: colors.black,
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				overflowY: 'hidden',
				position: 'relative',
				width: '100%'
			}}
		>
			<div style={{ color: colors.white, fontSize: 128 }}>Rubric</div>
			<div style={{ color: colors.white, fontSize: 48 }}>Website</div>
		</div>
	)
}

export default async function Response(_: ImageProps) {
	const localFont = await fetch(new URL('/src/app/fonts/matter-regular.woff', import.meta.url)).then(
		res => res.arrayBuffer()
	)

	return new ImageResponse(<Component />, {
		...size,
		fonts: [
			{
				name: 'Matter',
				data: localFont,
				style: 'normal',
				weight: 400
			}
		]
	})
}
