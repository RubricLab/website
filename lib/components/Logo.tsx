export default function Logo() {
	const block = 'h-10 w-10 bg-black'
	const invisible = 'h-10 w-10 bg-transparent'
	return (
		<div className="grid grid-cols-3 grid-rows-3">
			{/* First row */}
			<span className={block} />
			<span className={invisible} />
			<span className={block} />

			{/* Second row */}
			<span className={block} />
			<span className={block} />
			<span className={invisible} />

			{/* Third row */}
			<span className={block} />
			<span className={invisible} />
			<span className={invisible} />
		</div>
	)
}
