import { GithubIcon } from './icons/github'
import { LinkedinIcon } from './icons/linkedin'
import { XIcon } from './icons/x'
import { Wordmark } from './logos/wordmark'
import { NewsletterForm } from './newsletter-form'

export const Footer = () => {
	return (
		<footer className="flex w-full justify-center">
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
						<div className="flex gap-2 text-secondary">
							<a className="hover:text-primary" href="https://x.com/rubriclabs">
								<XIcon className="h-4 w-4" />
							</a>
							<a className="hover:text-primary" href="https://github.com/rubriclabs">
								<GithubIcon className="h-4 w-4" />
							</a>
							<a className="hover:text-primary" href="https://www.linkedin.com/company/rubriclabs">
								<LinkedinIcon className="h-4 w-4" />
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
