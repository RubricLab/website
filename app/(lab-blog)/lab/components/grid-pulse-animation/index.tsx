import cn from '@/lib/utils/cn'
import {CSSProperties} from 'styled-components'

import s from './grid-pulse-animation.module.css'

export const GridPulseAnimation = ({
	grid,
	cellSize
}: {
	grid: [number, number]
	cellSize: string
}) => {
	const length = grid[0] * grid[1]
	return (
		<div
			className='border-l border-t border-border'
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${grid[0]}, ${cellSize})`,
				gridTemplateRows: `repeat(${grid[1]}, ${cellSize})`
			}}>
			{Array.from({length: length}, (_, idx) => (
				<div
					key={idx}
					className={cn('border-b border-r border-border bg-transparent', {
						[s['animate-cell']]: true
					})}
					style={{aspectRatio: '1/1', '--idx': length - idx} as CSSProperties}></div>
			))}
		</div>
	)
}
