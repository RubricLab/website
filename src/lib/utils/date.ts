// Formats a date string into a human-readable format e.g. "2026-02-10" -> "February 10, 2026"
export const formatDate = (date: string) => {
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		timeZone: 'UTC',
		year: 'numeric'
	}

	return new Date(date).toLocaleDateString('en-US', options)
}
