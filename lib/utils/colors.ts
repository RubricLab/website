import colors from 'tailwindcss/colors'

export function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

	if (!result) throw new Error('Invalid hex color')

	return [
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		Number.parseInt(result[1]!, 16),
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		Number.parseInt(result[2]!, 16),
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		Number.parseInt(result[3]!, 16)
	].join(' ')
}

export const isTailwindColor = (color: string): color is keyof typeof colors => {
	return Object.keys(colors).includes(color)
}

export const shades = {
	'50': '#f6f6f6',
	'100': '#e7e7e7',
	'200': '#d1d1d1',
	'300': '#b0b0b0',
	'400': '#888888',
	'500': '#6d6d6d',
	'600': '#5d5d5d',
	'700': '#4f4f4f',
	'800': '#474747',
	'900': '#3d3d3d',
	'950': '#262626'
}

export const extendedColors = {
	...colors,
	shades
}
