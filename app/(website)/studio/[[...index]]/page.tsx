'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '~/sanity/config'

// Catch all route for redirecting /studio path to Sanity studio
export default function SanityStudioPage() {
	return <NextStudio config={config} />
}
