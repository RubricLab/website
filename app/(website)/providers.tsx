import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" enableSystem defaultTheme="system">
			<Toaster />
			{children}
		</ThemeProvider>
	)
}
