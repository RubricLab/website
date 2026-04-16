'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button, type ButtonProps } from '~/components/button'
import { Arrow } from '~/components/icons/arrow'

type Intent = NonNullable<ButtonProps['intent']>
type Size = NonNullable<ButtonProps['size']>

const INTENTS: readonly Intent[] = ['primary', 'secondary', 'ghost', 'link']
const SIZES: readonly Size[] = ['xs', 'sm', 'md', 'lg']

function Playground() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const intent = (searchParams.get('intent') ?? 'secondary') as Intent
	const size = (searchParams.get('size') ?? 'md') as Size
	const loading = searchParams.get('loading') === 'true'
	const disabled = searchParams.get('disabled') === 'true'
	const leading = searchParams.get('leading') === 'true'
	const trailing = searchParams.get('trailing') === 'true'

	function set(key: string, value: string | null) {
		const p = new URLSearchParams(searchParams.toString())
		if (value === null || value === '') p.delete(key)
		else p.set(key, value)
		router.replace(`${pathname}?${p.toString()}`, { scroll: false })
	}

	return (
		<div className="grid gap-6 md:grid-cols-[1fr_280px]">
			<div className="flex min-h-[280px] items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)]">
				<Button
					intent={intent}
					size={size}
					loading={loading}
					disabled={disabled}
					{...(leading && { leadingIcon: <Arrow /> })}
					{...(trailing && { trailingIcon: <Arrow /> })}
				>
					Button
				</Button>
			</div>
			<div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] p-5">
				<ControlSelect label="Intent" value={intent} options={INTENTS} onChange={v => set('intent', v)} />
				<ControlSelect label="Size" value={size} options={SIZES} onChange={v => set('size', v)} />
				<ControlToggle label="Leading icon" value={leading} onChange={v => set('leading', v ? 'true' : null)} />
				<ControlToggle label="Trailing icon" value={trailing} onChange={v => set('trailing', v ? 'true' : null)} />
				<ControlToggle label="Loading" value={loading} onChange={v => set('loading', v ? 'true' : null)} />
				<ControlToggle label="Disabled" value={disabled} onChange={v => set('disabled', v ? 'true' : null)} />
			</div>
		</div>
	)
}

function ControlSelect<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
	return (
		<label className="flex items-center justify-between gap-3">
			<span className="text-[11px] uppercase tracking-[0.08em] text-secondary">{label}</span>
			<select
				value={value}
				onChange={e => onChange(e.target.value as T)}
				className="rounded-[var(--radius-control)] border border-[var(--color-border-hairline)] bg-transparent px-2 py-1 text-[13px]"
			>
				{options.map(o => <option key={o} value={o}>{o}</option>)}
			</select>
		</label>
	)
}

function ControlToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
	return (
		<label className="flex cursor-pointer items-center justify-between gap-3">
			<span className="text-[11px] uppercase tracking-[0.08em] text-secondary">{label}</span>
			<input
				type="checkbox"
				checked={value}
				onChange={e => onChange(e.target.checked)}
				className="h-4 w-4 accent-[var(--color-primary)]"
			/>
		</label>
	)
}

function Swatch({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="mt-14">
			<h2 className="text-xl">{title}</h2>
			<div className="mt-4 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-8">
				{children}
			</div>
		</section>
	)
}

const TOKENS = [
	{ name: '--radius-control', role: 'Button corner radius', value: '6px' },
	{ name: '--color-primary', role: 'Primary fill bg / secondary text', value: 'black | white' },
	{ name: '--color-primary-foreground', role: 'Text on primary bg', value: 'background alias' },
	{ name: '--color-surface-raised', role: 'Secondary bg', value: 'accent alias' },
	{ name: '--color-surface-raised-hover', role: 'Secondary bg on hover', value: 'accent-hover alias' },
	{ name: '--color-surface-ghost-hover', role: 'Ghost bg on hover', value: 'subtle alias' },
	{ name: '--color-border-hairline', role: 'Secondary border rest', value: '10% primary' },
	{ name: '--color-border-strong', role: 'Secondary border on hover', value: 'tint @ 30%' },
	{ name: '--color-focus-ring', role: 'Focus ring', value: 'primary (WCAG 3:1)' },
	{ name: '--color-disabled-foreground', role: 'Disabled text/icon', value: 'secondary @ 90%' },
	{ name: '--color-disabled-surface', role: 'Disabled primary bg', value: 'primary @ 10%' },
	{ name: '--text-label-xs/sm/md/lg', role: 'Label sizes', value: '12 / 13 / 14 / 15 px' },
	{ name: '--space-button-y-{size}', role: 'Vertical pad', value: '4 / 6 / 8 / 10 px' },
	{ name: '--space-button-x-{size}', role: 'Horizontal pad', value: '10 / 12 / 14 / 18 px' },
	{ name: '--space-button-gap', role: 'Icon-to-label gap', value: '6 px' },
	{ name: '--duration-fast / -normal', role: 'Motion', value: '150 / 220 ms' },
	{ name: '--easing-out', role: 'Default easing', value: 'cubic-bezier(0.16, 1, 0.3, 1)' }
] as const

export default function ButtonPage() {
	return (
		<main className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
			<header>
				<p className="text-[11px] uppercase tracking-[0.08em] text-secondary">Primitive</p>
				<h1 className="mt-2 text-4xl">Button</h1>
				<p className="mt-2 max-w-[640px] text-secondary">
					Actions only. Form submits, onClick handlers, toggles. For navigation use{' '}
					<span className="font-mono text-[13px]">{'<Link>'}</span>. 4 intents × 4 sizes × 6 states.
				</p>
			</header>

			<section className="mt-10">
				<h2 className="text-xl">Playground</h2>
				<p className="mt-1 text-[13px] text-secondary">URL is the state — shareable & bookmarkable.</p>
				<div className="mt-4">
					<Suspense fallback={null}>
						<Playground />
					</Suspense>
				</div>
			</section>

			<Swatch title="Intents (md, rest)">
				{INTENTS.map(i => (
					<Button key={i} intent={i} size="md">{i}</Button>
				))}
			</Swatch>

			<Swatch title="Sizes (secondary, rest)">
				{SIZES.map(s => (
					<Button key={s} intent="secondary" size={s}>{s}</Button>
				))}
			</Swatch>

			<Swatch title="States (secondary md)">
				<Button intent="secondary" size="md">rest</Button>
				<Button intent="secondary" size="md" disabled>disabled</Button>
				<Button intent="secondary" size="md" loading>loading</Button>
				<span className="text-[13px] text-secondary">hover · focus-visible · active shown on interaction</span>
			</Swatch>

			<Swatch title="Icons + asChild composition">
				<Button intent="primary" size="md" trailingIcon={<Arrow />}>Primary + arrow</Button>
				<Button intent="secondary" size="md" leadingIcon={<Arrow />}>Leading arrow</Button>
				<Button intent="ghost" size="md" iconOnly aria-label="Arrow"><Arrow /></Button>
			</Swatch>

			<section className="mt-14">
				<h2 className="text-xl">Tokens consumed</h2>
				<div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border-hairline)]">
					<table className="w-full text-[13px]">
						<thead className="bg-[var(--color-surface-raised)]">
							<tr>
								<th className="py-2 px-4 text-left font-normal text-secondary">Token</th>
								<th className="py-2 px-4 text-left font-normal text-secondary">Role</th>
								<th className="py-2 px-4 text-left font-normal text-secondary">Value</th>
							</tr>
						</thead>
						<tbody>
							{TOKENS.map(t => (
								<tr key={t.name} className="border-t border-[var(--color-border-hairline)]">
									<td className="py-2 px-4 font-mono">{t.name}</td>
									<td className="py-2 px-4 text-secondary">{t.role}</td>
									<td className="py-2 px-4 font-mono">{t.value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="mt-14">
				<h2 className="text-xl">Spec</h2>
				<p className="mt-1 text-[13px] text-secondary">
					Full contract in <span className="font-mono">forge/button/02-spec.md</span>. Variants, states, a11y, composition patterns, migration map.
				</p>
			</section>
		</main>
	)
}
