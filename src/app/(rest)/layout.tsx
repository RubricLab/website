import { Footer } from '~/ui/footer'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Footer />
		</>
	)
}
