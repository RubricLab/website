import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { $ } from 'bun'

interface VideoQuality {
	name: string
	resolution: string
	bitrate: string
	codec: string
}

interface VideoInfo {
	width: number
	height: number
	duration: number
}

interface TranscodeConfig {
	inputFile: string
	outputDir: string
	segmentDuration: number
	qualities: VideoQuality[]
	ffmpegThreads: number
	ffmpegPreset: string
}

async function getVideoInfo(file: string): Promise<VideoInfo> {
	const { stdout } =
		await $`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of json ${file}`.quiet()
	const info = JSON.parse(stdout.toString())
	return {
		width: info.streams[0].width,
		height: info.streams[0].height,
		duration: Number.parseFloat(info.format.duration)
	}
}

function getResolutionWidth(resolution: string): number {
	const parts = resolution.split(':-1')
	if (parts.length === 0) throw new Error(`Invalid resolution format: ${resolution}`)
	const width = parts[0]
	if (!width) throw new Error(`Invalid resolution format: ${resolution}`)
	return Number.parseInt(width)
}

export async function transcodeVideo(config: TranscodeConfig): Promise<void> {
	if (!existsSync(config.inputFile)) {
		throw new Error(`Input file not found: ${config.inputFile}`)
	}

	// Create output directories
	await mkdir(config.outputDir, { recursive: true })
	await mkdir(path.join(config.outputDir, 'hls'), { recursive: true })

	// Get source video information and filter qualities
	const videoInfo = await getVideoInfo(config.inputFile)
	const availableQualities = config.qualities.filter(
		q => getResolutionWidth(q.resolution) <= videoInfo.width
	)
	if (availableQualities.length === 0) {
		throw new Error('Source video resolution is too low for any configured quality')
	}

	// Create preview MP4
	await $`ffmpeg -i ${config.inputFile} -vf scale=640:-1 -c:v libx264 -profile:v main -crf 23 -movflags +faststart -c:a aac -b:a 128k ${config.outputDir}/preview.mp4`

	// Process each quality level
	for (const quality of availableQualities) {
		const isHighRes = quality.name === '4k' || quality.name === '2k'
		// Always use H.264 for maximum browser compatibility
		const codec = quality.codec
		const crf = isHighRes ? 22 : 23

		// No HEVC-specific flags needed as we're standardizing on H.264
		await $`ffmpeg -i ${config.inputFile} -vf scale=${quality.resolution} \
      -c:v ${codec} -preset ${config.ffmpegPreset} -crf ${crf} \
      -threads ${config.ffmpegThreads} \
      -c:a aac -b:a ${isHighRes ? '192k' : '128k'} \
      -f hls -hls_time ${config.segmentDuration} -hls_playlist_type vod \
      -hls_segment_filename ${config.outputDir}/hls/${quality.name}_%03d.ts \
      ${config.outputDir}/hls/${quality.name}.m3u8`
	}

	// Create master HLS manifest
	const masterManifest = `#EXTM3U\n#EXT-X-VERSION:3\n${availableQualities
		.map(quality => {
			const width = getResolutionWidth(quality.resolution)
			const height = Math.round((width * 9) / 16)
			const bitrate = Number.parseInt(quality.bitrate.replace('k', '')) * 1000

			// Add codec information to help browsers identify compatible streams
			// Using standard H.264 High profile codec string for all qualities
			const codecInfo = 'CODECS="avc1.640028,mp4a.40.2"'

			return `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},RESOLUTION=${width}x${height},${codecInfo}\n${quality.name}.m3u8`
		})
		.join('\n')}`

	await writeFile(path.join(config.outputDir, 'hls', 'master.m3u8'), masterManifest)

	// Create metadata file
	const metadata = {
		generatedAt: new Date().toISOString(),
		sourceVideo: videoInfo,
		qualities: availableQualities.map(q => ({
			name: q.name,
			resolution: q.resolution,
			bitrate: q.bitrate,
			codec: 'AVC/H.264', // Always H.264 for all streams
			url: `hls/${q.name}.m3u8`
		})),
		hlsUrl: 'hls/master.m3u8',
		mp4Url: 'preview.mp4'
	}

	await writeFile(path.join(config.outputDir, 'metadata.json'), JSON.stringify(metadata, null, 2))
}

// transcodeVideo({
// 	inputFile: 'Architecting AI Systems.mov',
// 	outputDir: './processed',
// 	segmentDuration: 4,
// 	qualities: [
// 		{ name: '4k', resolution: '3840:-1', bitrate: '20000k', codec: 'libx264' },
// 		{ name: '2k', resolution: '2560:-1', bitrate: '12000k', codec: 'libx264' },
// 		{ name: '1080p', resolution: '1920:-1', bitrate: '6000k', codec: 'libx264' },
// 		{ name: '720p', resolution: '1280:-1', bitrate: '3000k', codec: 'libx264' },
// 		{ name: '480p', resolution: '854:-1', bitrate: '1400k', codec: 'libx264' }
// 	],
// 	ffmpegThreads: 0,
// 	ffmpegPreset: 'fast'
// })
