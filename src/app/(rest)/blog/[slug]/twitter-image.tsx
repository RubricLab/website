import { ImageResponse } from 'next/og'
import { getBaseUrl } from '~/lib/utils'
import { getPost, getPostSectionContent } from '~/lib/utils/posts'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'nodejs'
export const alt = 'Rubric Labs Blog'
export const contentType = 'image/png'
export const size = {
	height: 1200,
	width: 1200
}

export const Component = ({
	title,
	backgroundImageUrl,
	sectionTitle,
	sectionContent
}: {
	title: string
	backgroundImageUrl: string
	sectionTitle?: string
	sectionContent?: string
}) => {
	const isSection = sectionTitle && sectionContent

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
			{isSection ? (
				<div
					style={{
						background: 'rgba(0, 0, 0, 0.75)',
						bottom: 0,
						color: 'white',
						display: 'flex',
						flexDirection: 'column',
						gap: 24,
						left: 0,
						padding: 48,
						position: 'absolute',
						width: '100%'
					}}
				>
					<div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.2 }}>{sectionTitle}</div>
					<div
						style={{
							display: '-webkit-box',
							fontSize: 32,
							lineHeight: 1.4,
							opacity: 0.9,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							WebkitBoxOrient: 'vertical',
							WebkitLineClamp: 4
						}}
					>
						{sectionContent}
					</div>
				</div>
			) : (
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
			)}
		</div>
	)
}

export default async function Response({
	params,
	searchParams
}: {
	id: string
	params: Promise<{ slug: string }>
	searchParams: Promise<{ section?: string }>
}) {
	const baseUrl = getBaseUrl()

	const { slug } = await params
	const { section } = await searchParams

	const [{ metadata }, localFont, sectionData] = await Promise.all([
		getPost(slug),
		fetch(new URL(`${baseUrl}/fonts/matter-regular.woff`)).then(res => res.arrayBuffer()),
		section ? getPostSectionContent(slug, section) : Promise.resolve(null)
	])

	return new ImageResponse(
		<Component
			title={metadata.title}
			backgroundImageUrl={`${baseUrl}${metadata.bannerImageUrl}`}
			{...(sectionData && {
				sectionContent: sectionData.content,
				sectionTitle: sectionData.title
			})}
		/>,
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
