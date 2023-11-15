// Parse string to Date object and return "Month DD, YYYY" format
export default function parseDate(input: Date | string) {
	const date = new Date(input)
	const formattedDate = date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
	return formattedDate
}
