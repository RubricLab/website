'use client'

import { useActionState, useRef } from 'react'
import { createContactRequest } from '~/lib/actions/create-contact-request'
import { SITE } from '~/lib/constants'

type FormState = { success?: boolean; error?: string } | null

export function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null)
	const [state, formAction, isPending] = useActionState<FormState, FormData>(
		async (_prev, formData) => {
			const result = await createContactRequest(null, formData)
			if (result.success) {
				formRef.current?.reset()
			}
			return result as FormState
		},
		null
	)

	if (state?.success) {
		return (
			<div className="mx-auto max-w-[560px] py-32">
				<p className="font-sans text-2xl text-text-primary">Thanks. We'll be in touch.</p>
				<p className="mt-2 font-sans text-base text-text-secondary">
					We typically respond within a day.
				</p>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-[560px]">
			<p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
				Contact
			</p>
			<h1 className="mt-4 font-normal font-sans text-[clamp(28px,5vw,40px)] text-text-primary leading-tight tracking-tight">
				Tell us what you're building.
			</h1>
			<p className="mt-3 font-sans text-base text-text-secondary">
				We take on a small number of engagements per quarter.
			</p>
			<form ref={formRef} action={formAction} className="mt-12 space-y-10">
				<div className="group">
					<label htmlFor="name" className="mb-2 block font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						className="w-full border-0 border-border border-b bg-transparent py-3 font-sans text-base text-text-primary outline-none transition-colors duration-200 placeholder:text-text-tertiary/50 focus:border-b-text-secondary"
					/>
				</div>
				<div>
					<label htmlFor="company" className="mb-2 block font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
						Company
					</label>
					<input
						id="company"
						name="company"
						type="text"
						className="w-full border-0 border-border border-b bg-transparent py-3 font-sans text-base text-text-primary outline-none transition-colors duration-200 placeholder:text-text-tertiary/50 focus:border-b-text-secondary"
					/>
				</div>
				<div>
					<label htmlFor="email" className="mb-2 block font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="w-full border-0 border-border border-b bg-transparent py-3 font-sans text-base text-text-primary outline-none transition-colors duration-200 placeholder:text-text-tertiary/50 focus:border-b-text-secondary"
					/>
				</div>
				<div>
					<label htmlFor="message" className="mb-2 block font-mono text-[11px] text-text-tertiary uppercase tracking-wide">
						What are you working on?
					</label>
					<textarea
						id="message"
						name="message"
						rows={4}
						required
						className="w-full resize-none border-0 border-border border-b bg-transparent py-3 font-sans text-base text-text-primary outline-none transition-colors duration-200 placeholder:text-text-tertiary/50 focus:border-b-text-secondary"
					/>
				</div>
				{state?.error && <p className="font-mono text-red-400 text-sm">{state.error}</p>}
				<div className="flex items-center justify-between">
					<p className="font-mono text-[12px] text-text-tertiary">
						Or email{' '}
						<a
							href={`mailto:${SITE.email}`}
							className="text-text-secondary transition-colors duration-200 hover:text-text-primary"
						>
							{SITE.email}
						</a>
					</p>
					<button
						type="submit"
						disabled={isPending}
						className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-2.5 font-mono text-[13px] text-text-primary transition-all duration-300 hover:border-border-hover hover:bg-surface disabled:opacity-40"
					>
						<span>{isPending ? 'Sending...' : 'Send'}</span>
						{!isPending && (
							<span className="transition-transform duration-200 group-hover:translate-x-0.5">
								&rarr;
							</span>
						)}
					</button>
				</div>
			</form>
		</div>
	)
}
