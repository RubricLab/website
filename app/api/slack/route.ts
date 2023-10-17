import {NextResponse, type NextRequest} from 'next/server'

// Send Slack message
export async function POST(request: NextRequest) {
	const {name, email, body} = await request.json()

	// if (!name || !email || !body)
	// 	return NextResponse.json(
	// 		{error: 'Missing name, email, or body field'},
	// 		{status: 500}
	// 	)

	// // Slack client
	// const slack = new WebClient(process.env.SLACK_KEY)

	// // Send slack message
	// await slack.chat.postMessage({
	// 	channel: 'C05AQKAJL9X',
	// 	text: `${name}\n${email}\n${body}\n`
	// })

	return NextResponse.json({body: 'Success'}, {status: 200})
}
