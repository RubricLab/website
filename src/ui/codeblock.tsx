'use client'

import { type ReactElement, useEffect, useRef, useState } from 'react'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Copy } from './icons/copy'

// Dynamically import shiki to avoid SSR issues
let highlighterPromise: Promise<any> | null = null

const getHighlighter = async () => {
	if (!highlighterPromise) {
		highlighterPromise = import('shiki').then(async (shiki) => {
			return await shiki.createHighlighter({
				themes: ['github-dark-dimmed', 'github-light'],
				langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'jsonl', 'bash', 'python', 'rust', 'go', 'java', 'css', 'html', 'markdown']
			})
		})
	}
	return highlighterPromise
}

interface CodeBlockProps {
	children: ReactElement<{ children?: string; className?: string }>
	[key: string]: any
}

export const CodeBlock = ({ children, ...props }: CodeBlockProps) => {
	const { copied, handleCopy } = useClipboard()
	const containerRef = useRef<HTMLDivElement>(null)
	const [highlightedCode, setHighlightedCode] = useState<string | null>(null)

	useEffect(() => {
		const highlightCode = async () => {
			try {
				// Extract code content and language from children
				const codeElement = children?.props?.children
				const className = children?.props?.className || ''
				const languageMatch = className.match(/language-(\w+)/)
				const language = languageMatch?.[1] || 'text'
				const code = typeof codeElement === 'string' ? codeElement : String(codeElement || '')

				// Only highlight if we have actual code
				if (!code.trim()) {
					setHighlightedCode(null)
					return
				}

				const highlighter = await getHighlighter()
				
				// Map common language aliases
				const langMap: Record<string, string> = {
					'ts': 'typescript',
					'js': 'javascript',
					'sh': 'bash',
					'py': 'python',
					'rs': 'rust'
				}
				const mappedLang = langMap[language] || language

				// Check if language is supported, fallback to plaintext
				const supportedLangs = highlighter.getLoadedLanguages()
				const langToUse = supportedLangs.includes(mappedLang) ? mappedLang : 'plaintext'

				const html = highlighter.codeToHtml(code, {
					lang: langToUse,
					themes: {
						dark: 'github-dark-dimmed',
						light: 'github-light'
					},
					defaultColor: false
				})

				setHighlightedCode(html)
			} catch (error) {
				console.error('Failed to highlight code:', error)
				setHighlightedCode(null)
			}
		}

		highlightCode()
	}, [children])

	return (
		<div className="group relative">
			{highlightedCode ? (
				<div 
					ref={containerRef}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki-generated HTML is safe
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
					className="shiki-wrapper"
				/>
			) : (
				<pre ref={containerRef as any} {...props}>
					{children}
				</pre>
			)}
			<Button
				className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
				variant="icon"
				size="sm"
				onClick={() => handleCopy(containerRef.current?.textContent || 'Code not found')}
			>
				{copied ? <Checkmark className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</div>
	)
}
