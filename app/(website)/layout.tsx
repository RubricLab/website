import Footer from '@/lib/components/Footer'
import NavBar from '@/lib/components/NavBar'
import { META } from '@/lib/constants/metadata'
import PlausibleProvider from 'next-plausible'
import { Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './styles.css'
import cn from '@/lib/utils/cn'
import { Providers } from './providers'

const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

const neueBit = localFont({
	src: '../../public/fonts/PPNeueBit-Bold.otf',
	variable: '--font-neue-bit'
})

export const metadata = {
	metadataBase: new URL(META.siteURL)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<PlausibleProvider domain="rubriclabs.com" />
			</head>
			<body
				className={cn(
					'relative flex h-full min-h-screen w-full flex-col items-center',
					neueBit.variable,
					jakartaSans.className
				)}
			>
				<Providers>
					<NavBar />
					<main className="z-30 mb-[80vh] min-h-screen w-full bg-background sm:mb-96">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	)
}
