import Link from 'next/link'
import { NewsletterForm } from '~/app/(rest)/newsletter/newsletter-form'
import { cn } from '~/lib/utils/cn'
import { GithubIcon } from '~/ui/icons/github'
import { LinkedInIcon } from '~/ui/icons/linkedin'
import { XIcon } from '~/ui/icons/x'
import { Wordmark } from '~/ui/logos/wordmark'
import { Copiable } from './copiable'

export const Footer = ({ className }: { className?: string }) => {
	return (
		<footer
			className={cn('flex w-full flex-col items-center justify-center space-y-24 py-20', className)}
		>
			<Wordmark className="text-amber-500" />
			<div className="w-full max-w-2xl space-y-16">
				<div className="flex w-full justify-between">
					<div className="flex w-full max-w-1/2 flex-col gap-4">
						<p>Newsletter</p>
						<NewsletterForm />
					</div>
					<div className="flex flex-col gap-4">
						<p>Socials</p>
						<div className="flex gap-5 text-secondary">
							<Link href="https://github.com/rubriclabs">
								<GithubIcon className="size-5" />
							</Link>
							<Link href="https://x.com/rubriclabs">
								<XIcon className="size-5" />
							</Link>
							<Link href="https://www.linkedin.com/company/rubriclabs">
								<LinkedInIcon className="size-5" />
							</Link>
						</div>
					</div>
				</div>
				<div className="w-full">
					<div className="flex w-fit flex-col gap-4">
						<p>Links</p>
						<div className="flex flex-wrap gap-5 text-secondary">
							<Link href="/newsletter">Newsletter</Link>
							<Link href="https://brand.rubriclabs.com">Brand</Link>
							<Link href="/privacy">Privacy</Link>
						</div>
					</div>
				</div>
				<div className="text-center font-mono text-secondary">
					<Copiable variant="link" content="https://rubriclabs.com" className="group relative">
						© Rubric Labs Inc.{' '}
						<span className="opacity-0 transition-opacity delay-500 duration-1000 group-hover:opacity-100">
							2049
						</span>
						<span className="absolute top-0 right-0 transition-opacity delay-500 duration-1000 group-hover:opacity-0">
							{new Date().getFullYear()}
						</span>
					</Copiable>
				</div>
			</div>
		</footer>
	)
}
