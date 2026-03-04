import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { toJpegImageResponse } from '~/lib/utils/og-image'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'nodejs'
export const revalidate = 86400
export const alt = 'Applied AI lab helping companies build intelligent applications'
export const contentType = 'image/jpeg'
export const size = {
	height: 630,
	width: 1200
}

const fontDataPromise = readFile(path.join(process.cwd(), 'src/app/fonts/matter-regular.woff'))
const rootImageDataPromise = readFile(path.join(process.cwd(), 'public/images/seedling.png'), 'base64')

export const Component = ({ rootImageSrc }: { rootImageSrc: string }) => {
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
				<img src={rootImageSrc} alt="Rubric Labs" width="100%" height="auto" />
			</div>
			<Rubric style={{ height: 56, marginBottom: 24, width: 56 }} />
			<div style={{ fontSize: 48 }}>Applied AI</div>
		</div>
	)
}

export default async function Image() {
	const [localFont, rootImageData] = await Promise.all([
		fontDataPromise,
		rootImageDataPromise
	])
	const rootImageSrc = `data:image/png;base64,${rootImageData}`
	const pngResponse = new ImageResponse(<Component rootImageSrc={rootImageSrc} />, {
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
	return toJpegImageResponse(pngResponse)
}
