// Figma Code Connect mapping for the Button primitive.
//
// Component set: file `spYDEBREV6M2Y9aZAXp7QM`, node `11:2`.
// Variant axes: Intent (primary|secondary|ghost|link) × Size (xs|sm|md|lg)
//               × State (rest|hover|focus-visible|active|disabled|loading)
// = 96 variants. Every variant collapses into runtime props on the code side:
//   - Intent → `intent`
//   - Size   → `size`
//   - State=disabled → `disabled={true}`
//   - State=loading  → `loading={true}`
//   - State=rest / hover / focus-visible / active → baseline render
//     (these are CSS pseudo-states on the code side, not props).
//
// Publishing: this file is the version-controlled source of truth. The
// Rubric Figma workspace is on the `pro` tier, which does not include
// Code Connect MCP registration or `figma connect publish`. When Rubric
// upgrades to an Organization/Enterprise seat, run `bunx figma connect
// publish` and the mapping below will light up Dev Mode snippets in
// Figma. Until then, designers read this file directly via the git link
// in the Figma component description.
import figma from '@figma/code-connect'
import { Button } from './button'

figma.connect(Button, 'https://www.figma.com/design/spYDEBREV6M2Y9aZAXp7QM?node-id=11-2', {
	props: {
		intent: figma.enum('Intent', {
			primary: 'primary',
			secondary: 'secondary',
			ghost: 'ghost',
			link: 'link'
		}),
		size: figma.enum('Size', {
			xs: 'xs',
			sm: 'sm',
			md: 'md',
			lg: 'lg'
		}),
		disabled: figma.enum('State', { disabled: true }),
		loading: figma.enum('State', { loading: true }),
		children: 'Button'
	},
	example: ({ intent, size, disabled, loading, children }) => (
		<Button intent={intent} size={size} disabled={disabled} loading={loading}>
			{children}
		</Button>
	)
})
