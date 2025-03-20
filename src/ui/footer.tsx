import { cn } from '~/lib/utils/cn'
import { Wordmark } from './logos/wordmark'
import { NewsletterForm } from './newsletter-form'

export const Footer = ({ className }: { className?: string }) => {
	return (
		<footer className={cn('flex w-full justify-center', className)}>
			<div className="flex h-full w-full max-w-5xl flex-col items-center justify-center">
				<Wordmark className="mb-20 h-auto w-full opacity-60" />
				<div className="grid w-full grid-cols-9 divide-x divide-black/10 border border-black/10 dark:divide-white/10 dark:border-white/10">
					<div className="col-span-3 flex flex-col gap-2 p-6 pt-10">
						<p className="font-semibold">Location</p>
						<p className="text-secondary">
							2967 Dundas St. W. #1670
							<br />
							Toronto ON, M6P 1Z2
						</p>
					</div>
					<div className="col-span-2 flex flex-col gap-2 p-6 pt-10">
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
					<div className="col-span-4 flex flex-col justify-between gap-2 p-6 pt-10">
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
