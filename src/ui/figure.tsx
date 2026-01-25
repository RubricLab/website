export const Caption = ({ children }: { children: React.ReactNode }) => {
	return <figcaption className="text-secondary text-sm">{children}</figcaption>
}

export const Figure = ({ children }: { children: React.ReactNode }) => {
	return <figure className="flex flex-col items-center gap-1">{children}</figure>
}
