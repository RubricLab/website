import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { getPost, getPostSlugs } from '~/lib/utils/posts'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'nodejs'
export const contentType = 'image/png'
export const size = {
	height: 1200,
	width: 1200
}

export async function generateStaticParams() {
	const slugs = await getPostSlugs()
	return slugs.map(slug => ({ slug }))
}

export const Component = ({
	title,
	backgroundImageUrl
}: {
	title: string
	backgroundImageUrl: string
}) => {
	return (
		<div
			style={{
				alignItems: 'center',
				color: 'white',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				overflowY: 'hidden',
				position: 'relative',
				width: '100%'
			}}
		>
			{backgroundImageUrl ? (
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
					<img src={backgroundImageUrl} alt={title} width="100%" height="100%" />
				</div>
			) : null}
			<div
				style={{
					alignItems: 'center',
					backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
					color: 'white',
					display: 'flex',
					justifyContent: 'space-between',
					left: 0,
					padding: 48,
					position: 'absolute',
					top: 0,
					width: '100%'
				}}
			>
				<Rubric style={{ height: 48, width: 48 }} />
				<div style={{ fontSize: 48 }}>Rubric Labs Blog</div>
			</div>
			<div
				style={{
					backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
					bottom: 0,
					color: 'white',
					display: 'flex',
					justifyContent: 'space-between',
					left: 0,
					padding: 48,
					position: 'absolute',
					width: '100%'
				}}
			>
				<div style={{ fontSize: 80 }}>{title}</div>
			</div>
		</div>
	)
}

export default async function Response({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	const [{ metadata }, localFont] = await Promise.all([
		getPost(slug),
		readFile(path.join(process.cwd(), 'src/app/fonts/matter-regular.woff'))
	])
	const bannerPath = metadata.bannerImageUrl.replace(/^\//, '')
	const extension = path.extname(bannerPath).toLowerCase()
	const mimeType =
		extension === '.png'
			? 'image/png'
			: extension === '.jpg' || extension === '.jpeg'
				? 'image/jpeg'
				: extension === '.webp'
					? 'image/webp'
					: 'image/png'
	const bannerData = await readFile(path.join(process.cwd(), 'public', bannerPath), 'base64')
	const bannerSrc = `data:${mimeType};base64,${bannerData}`

	return new ImageResponse(
		<Component title={metadata.title} backgroundImageUrl={bannerSrc} />,
		{
			...size,
			fonts: [
				{
					data: localFont,
					name: 'Matter',
					style: 'normal',
					weight: 400
				}
			]
		}
	)
}
