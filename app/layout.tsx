import PlausibleProvider from 'next-plausible'
import {Plus_Jakarta_Sans} from 'next/font/google'
import localFont from 'next/font/local'
import {META} from '../constants/metadata'
import BackgroundGrid from '../lib/components/BackgroundGrid'
import Footer from '../lib/components/Footer'
import NavBar from '../lib/components/NavBar'
import {ToastProvider} from '../lib/components/Toast'
import './styles.css'

const jakartaSans = Plus_Jakarta_Sans({subsets: ['latin']})

const neueBit = localFont({
	src: '../public/fonts/PPNeueBit-Bold.otf',
	variable: '--font-neue-bit'
})

export const metadata = {
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US'
		}
	},
	metadataBase: new URL(META.siteURL)
}

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en'>
			<head>
				<PlausibleProvider domain='rubriclabs.com' />
				<meta
					content='https://rubriclabs.com/twitter-image?01'
					name='twitter:image'
				/>
			</head>
			<body
				className={`${jakartaSans.className} ${neueBit.variable} relative flex h-full min-h-screen w-full flex-col items-center`}>
				<NavBar />
				<BackgroundGrid className='fixed z-0 h-full w-full' />
				<ToastProvider />
				<main className='z-10 w-full 2xl:max-w-6xl'>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
