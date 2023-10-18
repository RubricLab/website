interface Props {
	grid: number[][]
	running: boolean
}

export default function Grid({grid, running}: Props) {
	return (
		<div>
			{grid.map((row, i) => (
				<div
					className='flex'
					key={i}>
					{row.map((cell, j) => (
						<div
							className={`aspect-square w-full ${
								cell &&
								(running
									? 'bg-neutral-200 dark:bg-neutral-800'
									: 'bg-black dark:bg-white')
							}`}
							key={`${i},${j}`}
						/>
					))}
				</div>
			))}
		</div>
	)
}
