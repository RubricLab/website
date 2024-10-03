import clsx, { type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const isArbitraryValue = (value: string) => /^\[.+\]$/.test(value)

const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			/* This prevents text-em value wipping other text-* classes */
			'font-size': [{ 'text-em': [isArbitraryValue] }]
		}
	}
})

// Allows merging of Tailwind class
export default function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
