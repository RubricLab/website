import { GeistSans } from 'geist/font/sans'
import { JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next/types'
import Providers from '~/app/providers'
import { Footer } from '~/components/footer'
import { Nav } from '~/components/nav'
import './globals.css'

const mono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
	weight: ['400', '500']
})

export const metadata: Metadata = {
	description:
		'AI systems research and production engineering. We study how agents should be built, then we build them.',
	metadataBase: new URL('https://rubriclabs.com'),
	openGraph: {
		description: 'AI systems research and production engineering.',
		siteName: 'Rubric',
		title: 'Rubric — A lab that ships.',
		type: 'website',
		url: 'https://rubriclabs.com'
	},
	robots: {
		follow: true,
		index: true
	},
	title: {
		default: 'Rubric — A lab that ships.',
		template: '%s — Rubric'
	},
	twitter: {
		card: 'summary_large_image',
		site: '@rubriclabs'
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${mono.variable}`}>
			<body className="font-sans bg-bg">
				<Providers>
					<Nav />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	)
}
