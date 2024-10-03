export default function Title({
	size,
	invert
}: {
	size: 'small' | 'full'
	invert?: boolean
}) {
	return (
		<p
			className={`mt-[3px] font-neue-bit text-4xl ${
				invert ? 'text-white dark:text-black' : 'text-black dark:text-white'
			}`}
		>
			<span>Rubric</span> {size === 'full' && <span>Labs</span>}
		</p>
	)
}
