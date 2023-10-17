'use client'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
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
	let grid: number[][] = []
	for (let i = 0; i < gridSize.rows; i++)
		grid.push(Array.from(Array(gridSize.cols), () => 0))

	// Center of the grid
	const centerRow = Math.floor(gridSize.rows / 2)
	const centerCol = Math.floor(gridSize.cols / 2)

	// Your pattern
	const pattern = [
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0]
	]

	// Insert the pattern into the grid at the center
	for (let i = 0; i < pattern.length; i++)
		for (let j = 0; j < pattern[0].length; j++)
			grid[centerRow - 1 + i][centerCol - 1 + j] = pattern[i][j]

	return grid
}

function getNextGen(grid: number[][]) {
	let newGrid = copyGrid(grid)
	for (let i = 0; i < grid.length; i++)
		for (let j = 0; j < grid[0].length; j++) {
			const neighbours = getNeighbours(grid, i, j)
			if (neighbours < 2 || neighbours > 3) newGrid[i][j] = 0
			if (neighbours === 3) newGrid[i][j] = 1
		}

	return newGrid
}

function copyGrid(grid: number[][]) {
	return grid.map(arr => arr.slice())
}

function getNeighbours(grid: number[][], i: number, j: number) {
	let numNeighbours = 0
	neighbours.map(n => {
		const realI = i + n[1]
		const realJ = j + n[0]
		if (realI >= 0 && realI < grid.length && realJ >= 0 && realJ < grid[0].length)
			numNeighbours += grid[realI][realJ]
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
	let min_width = 60 // Minimum width for a box in pixels
	let speed = 75

	// Calculate even grid dimensions based on screen size
	const calculateEvenGridSize = (): GridSize => {
		const screenHeight = window.innerHeight
		const screenWidth = window.innerWidth

		// Make sure that the number of rows and columns is even
		const rows = Math.floor(screenHeight / min_width) * 2
		const cols = Math.floor(screenWidth / min_width) * 2

		return {rows, cols}
	}

	const [gridSize, setGridSize] = useState<GridSize>({cols: 40, rows: 20})
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
	}, [])

	useEffect(() => {
		setGridSize(calculateEvenGridSize())
		setGrid(generateGrid(calculateEvenGridSize()))
	}, [])

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
	}, [running, speed])

	return (
		<div className='absolute left-0 top-0 z-[-1] min-h-screen w-full'>
			<Grid
				running={running}
				grid={grid}
			/>
		</div>
	)
}
