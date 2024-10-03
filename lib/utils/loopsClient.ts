import { LoopsClient } from 'loops'
import env from '../env'

// Loops emailing client
const loopsClient = new LoopsClient(env.LOOPS_API_KEY)

export default loopsClient
