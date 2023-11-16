import LoopsClient from 'loops'

// Loops emailing client
const loopsClient = new LoopsClient(process.env.LOOPS_API_KEY)

export default loopsClient
