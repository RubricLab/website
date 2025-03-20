import { ADDRESS } from '~/lib/constants'
import { cn } from '~/lib/utils/cn'
import { Copiable } from './copiable'
import { Wordmark } from './logos/wordmark'
import { NewsletterForm } from './newsletter-form'

export const Footer = ({ className }: { className?: string }) => {
	return (
		<footer className={cn('flex w-full justify-center px-6', className)}>
			<div className="flex h-full w-full max-w-5xl flex-col items-center justify-center">
				<Wordmark className="mb-20 h-auto w-full" />
				<div className="grid w-full divide-y divide-black/10 border border-black/10 sm:grid-cols-9 sm:divide-x dark:divide-white/10 dark:border-white/10">
					<div className="flex flex-col gap-2 p-6 sm:col-span-3">
						<p className="font-semibold">Location</p>
						<Copiable
							className="whitespace-pre text-left text-secondary"
							variant="link"
							content={ADDRESS}
						>
							<p className="font-mono">{ADDRESS}</p>
						</Copiable>
					</div>
					<div className="flex flex-col gap-2 p-6 sm:col-span-2">
						<p className="font-semibold">Follow us</p>
						<div className="flex flex-col text-secondary">
							<a className="hover:text-primary" href="https://github.com/rubriclabs">
								GitHub
							</a>
							<a className="hover:text-primary" href="https://x.com/rubriclabs">
								X
							</a>
							<a className="hover:text-primary" href="https://www.linkedin.com/company/rubriclabs">
								LinkedIn
							</a>
						</div>
					</div>
					<div className="flex flex-col justify-between gap-2 p-6 sm:col-span-4">
						<p className="font-semibold">Newsletter</p>
						<NewsletterForm />
					</div>
				</div>
				<div className="flex w-full border-black/10 border-x p-6 font-lighter font-mono text-sm uppercase dark:border-white/10">
					<a href="/privacy">Privacy & terms</a>
					<div className="grow" />
					<p>© Rubric Labs™ {new Date().getFullYear()}</p>
				</div>
			</div>
		</footer>
	)
}
