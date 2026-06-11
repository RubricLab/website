import localFont from 'next/font/local'
import { META } from '~/lib/constants/metadata'
import { cn } from '~/lib/utils/cn'
import { createMetadata } from '~/lib/utils/create-metadata'
import { Copiable } from '~/ui/copiable'
import { AssetCard } from './asset-card'

const jakartaBold = localFont({ src: '../../../../public/brand/fonts/PlusJakartaSans-Bold.ttf' })
const jakartaSemiBold = localFont({
	src: '../../../../public/brand/fonts/PlusJakartaSans-SemiBold.ttf'
})
const neueBit = localFont({ src: '../../../../public/brand/fonts/PPNeueBit-Bold.otf' })

export const metadata = createMetadata({
	description: `Logos, colors, typography, and usage guidelines for the Rubric brand. ${META.description}`,
	pathname: '/brand',
	title: `Brand | ${META.title}`
})

const FIGMA_URL =
	'https://www.figma.com/file/tRoDcoEfD0hSfhvKs4lzZR/Rubric-Branding-(TEMP-Copy)?type=design&node-id=46%3A79&mode=design&t=fdSx4pbKSYB66sgb-1'

const about = [
	{ content: 'Rubric', label: 'Name' },
	{ content: 'https://rubriclabs.com', label: 'Website' },
	{ content: 'hello@rubriclabs.com', label: 'Email' }
]

const fonts = [
	{
		className: jakartaBold.className,
		file: '/brand/fonts/PlusJakartaSans-Bold.ttf',
		name: 'Plus Jakarta Sans Bold',
		role: 'Headings'
	},
	{
		className: cn(neueBit.className, 'text-5xl'),
		file: '/brand/fonts/PPNeueBit-Bold.otf',
		name: 'PP Neue Bit Bold',
		role: 'Highlights'
	},
	{
		className: jakartaSemiBold.className,
		file: '/brand/fonts/PlusJakartaSans-SemiBold.ttf',
		name: 'Plus Jakarta Sans Semi-Bold',
		role: 'Body'
	}
]

const colors = [
	{ className: 'bg-white', hex: '#FFFFFF' },
	{ className: 'bg-black', hex: '#000000' }
]

export default function Page() {
	return (
		<div className="flex flex-col items-center p-4 py-32">
			<div className="flex w-full max-w-4xl flex-col gap-24">
				<div className="flex flex-col items-center gap-2">
					<h1>Brand</h1>
					<p className="text-secondary">Guidelines for using the Rubric brand</p>
				</div>

				<section>
					<h2 className="text-2xl">About us</h2>
					<p className="max-w-2xl text-secondary">
						Rubric is a digital agency building AI-first software. Over the past decade of building and
						scaling products as founders, we have built a framework that prioritizes simple, fast and
						scalable solutions to complex problems, with empathy for the people who use them. In weeks, we
						can deliver a show-stopping feature set, product or pivot. If you have an idea, project or
						problem, drop us a line.
					</p>
					<div className="flex flex-col items-start">
						{about.map(({ label, content }) => (
							<div key={label} className="flex items-baseline gap-2">
								<span className="w-20 text-secondary text-sm">{label}</span>
								<Copiable variant="link" content={content} message={`${label} copied`}>
									{content}
								</Copiable>
							</div>
						))}
					</div>
				</section>

				<section>
					<h2 className="text-2xl">Logo + wordmark</h2>
					<ul className="list-inside list-disc text-secondary">
						<li>The Rubric logo exists in a 9×9 pixel grid.</li>
						<li>The Rubric wordmark exists in a 22×9 pixel grid.</li>
						<li>
							If exported as raster, use height multiples of 9. For example, 900×900 for the logo or
							2200×900 for the wordmark.
						</li>
					</ul>
					<p className="text-secondary">
						Tip: right-click the logo in the nav to copy or download these from anywhere on the site.
					</p>
					<div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2">
						<AssetCard kind="logo" variant="black" />
						<AssetCard kind="logo" variant="white" />
						<AssetCard kind="wordmark" variant="black" />
						<AssetCard kind="wordmark" variant="white" />
					</div>
					<a
						href="/brand/rubric-assets.zip"
						download
						className="inline-block pt-4 text-secondary underline decoration-1 underline-offset-3 hover:decoration-4"
					>
						Download all assets (.zip)
					</a>
				</section>

				<section>
					<h2 className="text-2xl">Brand colors</h2>
					<div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2">
						{colors.map(({ hex, className }) => (
							<div key={hex} className="flex flex-col gap-2">
								<div className={cn('h-40 w-full rounded-custom border border-subtle', className)} />
								<Copiable variant="link" content={hex} message={`${hex} copied`}>
									{hex}
								</Copiable>
							</div>
						))}
					</div>
				</section>

				<section>
					<h2 className="text-2xl">Typography</h2>
					<div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2">
						{fonts.map(({ role, name, className, file }) => (
							<div key={name} className="flex flex-col gap-6 rounded-custom border border-subtle p-6">
								<p className="text-secondary text-sm">{role}</p>
								<div className={className}>
									<p className="text-3xl">{name}</p>
									<p className="pt-2 text-secondary">AaBbCcDdEeFfGg 0123456789</p>
								</div>
								<a href={file} download className="mt-auto w-fit text-sm">
									Download font
								</a>
							</div>
						))}
					</div>
				</section>

				<section>
					<h2 className="text-2xl">Collaboration</h2>
					<p className="text-secondary">
						Everything here is open source: free to use, copy, modify etc. without attribution or
						permission. The source file lives in{' '}
						<a href={FIGMA_URL} target="_blank" rel="noreferrer" className="underline">
							Figma
						</a>
						.
					</p>
					<p className="text-secondary">
						If you have questions or feedback, email us at{' '}
						<a href="mailto:hello@rubriclabs.com" className="underline">
							hello@rubriclabs.com
						</a>
						.
					</p>
				</section>
			</div>
		</div>
	)
}
