import localFont from 'next/font/local'
import type { Metadata } from 'next/types'
import Providers from '~/app/providers'
import { META } from '~/lib/constants/metadata'
import './globals.css'
import { getBaseUrl } from '~/lib/utils'
import { Nav } from '~/ui/nav'

const matter = localFont({ src: './fonts/matter-regular.woff' })

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	metadataBase: new URL(getBaseUrl()),
	...META
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				className={`${matter.className} relative flex h-full min-h-screen w-full flex-col items-center`}
			>
				<Providers>
					<Nav />
					<div className="min-h-screen w-screen">{children}</div>
				</Providers>
			</body>
		</html>
	)
}
