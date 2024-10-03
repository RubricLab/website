import { Client } from '@notionhq/client'
import env from '../env'

const notionClient = new Client({ auth: env.NOTION_API_KEY })

export default notionClient
