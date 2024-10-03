import { toast } from '~/components/Toast'

// Copy to clipboard
export default function copyToClipboard(input: string) {
	navigator.clipboard.writeText(input)
	toast.success('Email copied')
}
