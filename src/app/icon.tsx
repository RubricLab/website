import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'
export const size = {
	height: 32,
	width: 32
}

export default async function Icon() {
	return new ImageResponse(
		<svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<title>Rubric icon</title>
			<rect width="64" height="64" fill="black" />
			<path
				d="M12.7998 12.7998H25.5998V25.5998H38.3998V38.3998H25.5998V51.1998H12.7998V12.7998Z"
				fill="white"
			/>
			<path d="M38.3998 25.5998V12.7998H51.1998V25.5998H38.3998Z" fill="white" />
		</svg>,
		{ ...size }
	)
}
