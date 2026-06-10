import type { InputHTMLAttributes, ReactNode } from 'react'

// Shared visual shell for the onboarding flows — a mobile phone frame so all
// three versions look consistent. Sized to drop into a demo column: ~340-360px
// wide, fixed height, white surface regardless of the surrounding site theme.
export const Phone = ({ children }: { children: ReactNode }) => (
	<div className="relative mx-auto flex h-[560px] w-full max-w-[360px] flex-col overflow-hidden rounded-lg border border-subtle bg-white text-gray-900">
		{children}
	</div>
)

export const Logo = () => (
	<div className="flex items-center gap-2">
		<div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600">
			<div className="h-3 w-3 rounded-sm bg-white/90" />
		</div>
		<span className="font-extrabold text-gray-900 tracking-tight">Cadence</span>
	</div>
)

export const Field = ({
	label,
	hint,
	error,
	children
}: {
	label: string
	hint?: string
	error?: string
	children: ReactNode
}) => (
	// biome-ignore lint/a11y/noLabelWithoutControl: the associated Input is passed in via children
	<label className="block">
		<div className="flex items-baseline justify-between">
			<span className="font-medium text-[13px] text-gray-700">{label}</span>
			{hint && <span className="text-[11px] text-gray-400">{hint}</span>}
		</div>
		<div className="mt-1">{children}</div>
		{error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
	</label>
)

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
	<input
		{...props}
		className={`w-full rounded-xl border border-gray-300 px-3.5 py-3 text-[15px] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${className ?? ''}`}
	/>
)
