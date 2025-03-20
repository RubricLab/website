export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col items-center gap-16 py-32">
			<article className="mx-auto max-w-2xl space-y-6">{children}</article>
		</div>
	)
}
