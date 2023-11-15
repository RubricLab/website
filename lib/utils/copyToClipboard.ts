import toast from 'react-hot-toast'

// Copy to clipboard
export default function copyToClipboard(input: string) {
	navigator.clipboard.writeText(input)
	toast.success('Email copied')
}
