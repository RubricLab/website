import localFont from 'next/font/local'
import type { Metadata } from 'next/types'
import Providers from '~/app/providers'
import { DEFAULT_META } from '~/lib/constants/metadata'
import './globals.css'
import Nav from '~/ui/nav'
import { Footer } from '~/ui/footer'

const matter = localFont({ src: './fonts/matter-regular.woff' })

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	metadataBase: new URL(
		process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT || 3000}`
	),
	...DEFAULT_META
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				className={`${matter.className} relative flex h-full min-h-screen w-full flex-col items-center`}
			>
				<Nav />
				<Providers>
					<div className="min-h-screen w-screen">{children}</div>
				</Providers>
				<Footer />
			</body>
		</html>
	)
}
