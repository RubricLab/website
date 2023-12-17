import PlausibleProvider from 'next-plausible'
import {Plus_Jakarta_Sans} from 'next/font/google'
import localFont from 'next/font/local'
import Footer from '~/components/Footer'
import NavBar from '~/components/NavBar'
import {Toaster} from '~/components/Toast'
import {META} from '~/constants/metadata'
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
			</head>
			<body
				className={`${jakartaSans.className} ${neueBit.variable} relative flex h-full min-h-screen w-full flex-col items-center`}>
				<NavBar />
				<Toaster />
				<main className='z-30 mb-96 min-h-screen w-full bg-white dark:bg-black'>
					{children}
				</main>
				<Footer />
			</body>
		</html>
	)
}
