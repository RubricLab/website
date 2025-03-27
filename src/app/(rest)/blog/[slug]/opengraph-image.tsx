import { ImageResponse } from 'next/og'
import { getBaseUrl } from '~/lib/utils'
import { getPost } from '~/lib/utils/posts'
import { Rubric } from '~/ui/logos/rubric'

export const runtime = 'nodejs'
export const contentType = 'image/png'

export const Component = ({
	title,
	backgroundImageUrl
}: { title: string; backgroundImageUrl: string }) => {
	return (
		<div
			style={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				width: '100%',
				justifyContent: 'center',
				color: 'white',
				overflowY: 'hidden',
				position: 'relative'
			}}
		>
			{backgroundImageUrl ? (
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
					<img src={backgroundImageUrl} alt={title} width="100%" height="100%" />
				</div>
			) : null}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					padding: 48,
					position: 'absolute',
					backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
					color: 'white',
					top: 0,
					left: 0
				}}
			>
				<Rubric style={{ width: 48, height: 48 }} />
				<div style={{ fontSize: 48 }}>Rubric Labs Blog</div>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
					padding: 48,
					position: 'absolute',
					backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
					color: 'white',
					bottom: 0,
					left: 0
				}}
			>
				<div style={{ fontSize: 80 }}>{title}</div>
			</div>
		</div>
	)
}

export default async function Response({ params }: { id: string; params: { slug: string } }) {
	const baseUrl = getBaseUrl()

	const { slug } = await params

	const [{ metadata }, localFont] = await Promise.all([
		getPost(slug),
		fetch(new URL(`${baseUrl}/fonts/matter-regular.woff`, import.meta.url)).then(res =>
			res.arrayBuffer()
		)
	])

	return new ImageResponse(
		<Component title={metadata.title} backgroundImageUrl={`${baseUrl}${metadata.bannerImageUrl}`} />,
		{
			fonts: [
				{
					name: 'Matter',
					data: localFont,
					style: 'normal',
					weight: 400
				}
			]
		}
	)
}
