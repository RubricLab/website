export const copy = (text: string) => {
	if (!navigator || !('clipboard' in navigator)) {
		alert('Clipboard is not supported')
		return
	}

	navigator.clipboard.writeText(text)
}
