import {getMetadata} from '../../lib/utils'
import Button from '../components/Button'
import {Card} from '../components/Card'

export const metadata = getMetadata({title: 'Partners'})

const partners = [
	{title: 'Vercel', href: 'https://vercel.com/experts/rubric'},
	{title: 'LangChain', href: 'https://www.langchain.com/partners'}
]

const Partners = async () => {
	return (
		<div className='my-20 flex w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full w-full max-w-3xl flex-col gap-20 p-8'>
				<h1>Partners</h1>
				<div className='flex w-full flex-col gap-5'>
					{partners
						.sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
						.map(partner => (
							<Card
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
