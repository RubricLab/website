import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationHighlight,
	transformerNotationWordHighlight
} from '@shikijs/transformers'
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime'
import * as prod from 'react/jsx-runtime'
import { type BundledLanguage, type BundledTheme, codeToHast } from 'shiki'

type ComponentsToOverride = Pick<Components, 'pre' | 'code' | 'span'>

type LightDarkTheme = {
	light: BundledTheme
	dark: BundledTheme
}

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

const themeConfig: LightDarkTheme = {
	light: 'catppuccin-latte',
	dark: 'tokyo-night'
}

export interface HighlighterProps {
	children: string
	lang: BundledLanguage
	components?: Partial<ComponentsToOverride>
}

export const Highlighter = async ({ children, lang, components }: HighlighterProps) => {
	const hast = await codeToHast(children, {
		lang,
		themes: themeConfig,

		transformers: [
			transformerNotationDiff(),
			transformerNotationErrorLevel(),
			transformerNotationHighlight(),
			transformerNotationWordHighlight(),
			{
				line(node, line) {
					node.children = [
						{
							type: 'element',
							tagName: 'span',
							properties: { class: 'line-indicator' },
							children: [{ type: 'text', value: line.toString() }]
						},
						...node.children
					]
				}
			}
		]
	})

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const content = toJsxRuntime(hast as any, {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...(production as any),
		components
	})

	return content
}
