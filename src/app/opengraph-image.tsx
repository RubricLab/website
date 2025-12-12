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

export default async function Response() {
	const baseUrl = getBaseUrl()

	const localFont = await fetch(`${baseUrl}/fonts/matter-regular.woff`).then(res =>
		res.arrayBuffer()
	)

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
