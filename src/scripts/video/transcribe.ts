import { writeFile } from 'node:fs/promises'
import { $ } from 'bun'

export async function transcribe(videoPath: string, apiKey: string): Promise<void> {
	// Extract audio
	await $`ffmpeg -i ${videoPath} -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`

	// Call OpenAI API
	const formData = new FormData()
	formData.append('file', new Blob([await Bun.file('audio.wav').arrayBuffer()]), 'audio.wav')
	formData.append('model', 'whisper-1')
	formData.append('response_format', 'vtt') // Request VTT format directly
	formData.append('prompt', 'The company name is Rubric, an applied AI lab.') // Add custom vocabulary hint

	const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`
		},
		body: formData
	})

	// Get VTT content directly from the API
	const vttContent = await response.text()
	await writeFile('transcription.vtt', vttContent)
}

// transcribe('Architecting AI Systems.mov', '')
