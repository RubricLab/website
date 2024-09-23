import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationHighlight,
	transformerNotationWordHighlight
} from '@shikijs/transformers'
import {toJsxRuntime, type Components} from 'hast-util-to-jsx-runtime'
import * as prod from 'react/jsx-runtime'
import {BundledTheme, codeToHast, type BundledLanguage} from 'shiki'

type ComponentsToOverride = Pick<Components, 'pre' | 'code' | 'span'>

type LightDarkTheme = {
	light: BundledTheme
	dark: BundledTheme
}

// @ts-expect-error - `toJsxRuntime` is not typed
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

const themeConfig: LightDarkTheme = {
	light: 'catppuccin-latte',
	dark: 'tokyo-night'
}

export interface HighlighterProps {
	children: string
	lang: BundledLanguage
	components?: Partial<ComponentsToOverride>
}

export const Highlighter = async ({
	children,
	lang,
	components
}: HighlighterProps) => {
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
							properties: {class: 'line-indicator'},
							children: [{type: 'text', value: line.toString()}]
						},
						...node.children
					]
				}
			}
		]
	})

	const content = toJsxRuntime(hast as any, {
		...production,
		components
	})

	return content
}
