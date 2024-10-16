import { TooltipProvider } from '@/common/tooltip'
import { BaseHubThemeProvider } from '@/context/basehub-theme-provider'
import { Toolbar } from 'basehub/next-toolbar'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider enableSystem attribute="class" defaultTheme="system">
			<Toolbar />
			<BaseHubThemeProvider />
			<TooltipProvider>{children}</TooltipProvider>
		</ThemeProvider>
	)
}
