import { WebClient } from '@slack/web-api'
const slackClient = new WebClient(process.env.SLACK_API_KEY)

export default slackClient
