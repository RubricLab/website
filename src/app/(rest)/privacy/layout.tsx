export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<article className="mx-auto max-w-full sm:max-w-2xl">{children}</article>
		</div>
	)
}
