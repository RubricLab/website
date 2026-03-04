import sharp from 'sharp'

const DEFAULT_OG_JPEG_QUALITY = 98

export const toJpegImageResponse = async (
	response: Response,
	quality = DEFAULT_OG_JPEG_QUALITY
) => {
	const pngBuffer = Buffer.from(await response.arrayBuffer())
	const jpegBuffer = await sharp(pngBuffer)
		.jpeg({
			chromaSubsampling: '4:2:0',
			mozjpeg: true,
			progressive: true,
			quality
		})
		.toBuffer()

	const headers = new Headers(response.headers)
	headers.set('content-length', `${jpegBuffer.byteLength}`)
	headers.set('content-type', 'image/jpeg')

	return new Response(new Uint8Array(jpegBuffer), {
		headers,
		status: response.status,
		statusText: response.statusText
	})
}
