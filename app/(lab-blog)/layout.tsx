import {META} from '@/lib/constants/metadata'
import {GeistMono} from 'geist/font/mono'
import {GeistSans} from 'geist/font/sans'
import PlausibleProvider from 'next-plausible'
import {Providers} from './providers'

import Header from '@/common/lab-blog-layout/header'
import {GsapSetup} from '@/lib/gsap'
import './styles.css'

export const metadata = {
  metadataBase: new URL(META.siteURL)
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <PlausibleProvider domain='rubriclabs.com' />
      </head>

      <body className='px-sides font-mono'>
        <GsapSetup />
        <Providers>
          <Header />
          <div className='relative'>
            <main className='pt-header'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
