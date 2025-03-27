import { ImageResponse } from 'next/og'
import { getBaseUrl } from '~/lib/utils'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'edge'
export const alt = 'Applied AI lab helping companies get intelligence to production'
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
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				position: 'relative',
				color: 'white',
				width: '100%'
			}}
		>
			<div
				style={{
					display: 'flex',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				}}
			>
				<img src={`${getBaseUrl()}/images/seedling.png`} alt="Rubric Labs" width="100%" height="auto" />
			</div>
			<Rubric style={{ width: 56, height: 56, marginBottom: 24 }} />
			<div style={{ fontSize: 48 }}>Applied AI</div>
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
