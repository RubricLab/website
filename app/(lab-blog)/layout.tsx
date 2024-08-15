import {META} from '@/lib/constants/metadata'
import {GeistMono} from 'geist/font/mono'
import {GeistSans} from 'geist/font/sans'
import PlausibleProvider from 'next-plausible'
import {Providers} from './providers'

import './styles.css'

export const metadata = {
	metadataBase: new URL(META.siteURL)
}

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html
			lang='en'
			className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<head>
				<PlausibleProvider domain='rubriclabs.com' />
			</head>
			<body className='font-mono'>
				<Providers>
					<main className=''>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
