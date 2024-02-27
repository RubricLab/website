import agent from '~/assets/agent.png'
import desert from '~/assets/desert.png'
import tron from '~/assets/tron.png'
import LabProject from '~/components/LabProject'
import LabHero from '~/components/hero/LabHero'
import {Maige} from '~/components/logos/Maige'
import {LINKS} from '~/constants/links'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Lab',
	description:
		'We make AI-enabled magical software. Rubric is a digital studio specializing in LangChain, Next.js, and AI-enabled product development.',
	path: 'lab'
})

const projects = [
	{
		key: 'cra',
		title: <h2 className='font-mono text-3xl'>create-rubric-app</h2>,
		description: 'CLI tool to get started with a full-stack AI project',
		website: LINKS.cra.github,
		imageSrc: agent,
		imageAlt: 'Futuristic city scene',
		videoSrc: LINKS.cra.video
	},
	{
		key: 'maige',
		title: (
			<div className='flex gap-2'>
				<Maige className='w-8' />
				<h2 className='font-mono text-3xl'>maige</h2>
			</div>
		),
		description: 'run natural language workflows on your codebase',
		website: LINKS.maige.website,
		imageSrc: desert,
		imageAlt: 'Futuristic desert scene',
		videoSrc: LINKS.maige.video
	},
	{
		key: 'dashboard',
		title: <h2 className='font-mono text-3xl'>dashboard</h2>,
		description: 'coming soon',
		website: null,
		imageSrc: tron,
		imageAlt: 'Futuristic tron legacy inspired scene',
		videoSrc: null
	}
]

export default function Lab() {
	return (
		<div className='flex flex-col'>
			<LabHero />
			{projects.map(p => (
				<LabProject
					key={p.key}
					title={p.title}
					description={p.description}
					website={p.website}
					imageSrc={p.imageSrc}
					imageAlt={p.imageAlt}
					videoSrc={p.videoSrc}
				/>
			))}
		</div>
	)
}
