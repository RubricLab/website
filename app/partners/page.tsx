import {getMetadata} from '../../lib/utils'
import Button from '../components/Button'
import {Card} from '../components/Card'

export const metadata = getMetadata({title: 'Partners'})

const partners = [
	{
		title: 'Vercel',
		href: 'https://vercel.com/experts/rubric',
		description:
			'Vercel makes it easy for engineers to deploy and run web applications.'
	},
	{
		title: 'LangChain',
		href: 'https://www.langchain.com/partners',
		description:
			'LangChain is a framework for building LLM applications from prototype to production.'
	}
]

const Partners = async () => {
	return (
		<div className='my-20 flex w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full w-full max-w-3xl flex-col gap-20 px-5 sm:px-10'>
				<h1>Partners</h1>
				<div className='flex w-full flex-col gap-5'>
					{partners
						.sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
						.map(partner => (
							<Card
								body={partner.description}
								title={partner.title}
								url={partner.href}
								key={partner.title}
							/>
						))}
				</div>
				<Button
					body='Want to partner with us?'
					href='/contact'
					variant='light'
				/>
			</div>
		</div>
	)
}

export default Partners
