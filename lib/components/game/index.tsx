'use client'
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react'
import Grid from './Grid'

interface GridSize {
	cols: number
	rows: number
}

const neighbours = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1]
]

function generateGrid(gridSize: GridSize) {
	const grid: number[][] = []
	for (let i = 0; i < gridSize.rows; i++) grid.push(Array.from(Array(gridSize.cols), () => 0))

	// Center of the grid
	const centerRow = Math.floor(gridSize.rows / 2)
	const centerCol = Math.floor(gridSize.cols / 2)

	// Your pattern
	const pattern = [
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0]
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	] as any

	// Insert the pattern into the grid at the center
	for (let i = 0; i < pattern.length; i++)
		for (let j = 0; j < pattern[0].length; j++)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(grid[centerRow - 1 + i] as any)[centerCol - 1 + j] = pattern[i][j]

	return grid
}

function getNextGen(grid: number[][]) {
	const newGrid = copyGrid(grid)
	for (let i = 0; i < grid.length; i++)
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		for (let j = 0; j < (grid[0] as any).length; j++) {
			const neighbours = getNeighbours(grid, i, j)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			if (neighbours < 2 || neighbours > 3) (newGrid[i] as any)[j] = 0
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			if (neighbours === 3) (newGrid[i] as any)[j] = 1
		}

	return newGrid
}

function copyGrid(grid: number[][]) {
	return grid.map(arr => arr.slice())
}

function getNeighbours(grid: number[][], i: number, j: number) {
	let numNeighbours = 0
	neighbours.map(n => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const realI = i + (n[1] as any)
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const realJ = j + (n[0] as any)
		if (
			realI >= 0 &&
			realI < grid.length &&
			realJ >= 0 &&
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			realJ < (grid[0] as any).length
		)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			numNeighbours += (grid[realI] as any)[realJ]
	})
	return numNeighbours
}

export default function Game({
	running,
	setRunning
}: {
	running: boolean
	setRunning: Dispatch<SetStateAction<boolean>>
}) {
	const min_width = 60 // Minimum width for a box in pixels
	const speed = 75

	// Calculate even grid dimensions based on screen size
	const calculateEvenGridSize = useCallback((): GridSize => {
		const screenHeight = window.innerHeight
		const screenWidth = window.innerWidth

		// Make sure that the number of rows and columns is even
		const rows = Math.floor(screenHeight / min_width) * 2
		const cols = Math.floor(screenWidth / min_width) * 2

		return { cols, rows }
	}, [])

	const [gridSize, setGridSize] = useState<GridSize>({ cols: 40, rows: 20 })
	const [grid, setGrid] = useState(generateGrid(gridSize))

	useEffect(() => {
		// Recalculate grid size when window is resized
		const handleResize = () => {
			setGridSize(calculateEvenGridSize())
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [calculateEvenGridSize])

	useEffect(() => {
		setGridSize(calculateEvenGridSize())
		setGrid(generateGrid(calculateEvenGridSize()))
	}, [calculateEvenGridSize])

	useEffect(() => {
		if (!running) return
		const timer = setInterval(
			() => {
				setGrid(current => {
					const nextGen = getNextGen(current)
					if (JSON.stringify(current) === JSON.stringify(nextGen)) setRunning(false)

					return getNextGen(current)
				})
			},
			1000 - speed * 10
		)

		return () => clearInterval(timer)
	}, [running, setRunning])

	return (
		<div className="absolute top-0 left-0 z-[-1] min-h-screen w-full">
			<Grid grid={grid} running={running} />
		</div>
	)
}
