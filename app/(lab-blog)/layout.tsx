import {META} from '@/lib/constants/metadata'
import {GeistMono} from 'geist/font/mono'
import {GeistSans} from 'geist/font/sans'
import PlausibleProvider from 'next-plausible'
import {Providers} from './providers'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import Header from '@/common/lab-blog-layout/header'
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

			<body className='px-sides font-mono'>
				<Providers>
					<Header />
					<div className='relative'>
						<BackgroundGrid />
						<main className='pt-header'>{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	)
}
