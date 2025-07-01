export const formatDate = (date: string) => {
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}

	return new Date(date).toLocaleDateString('en-US', options)
}
