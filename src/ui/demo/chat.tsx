import { Messages } from './messages'

export function Chat() {
	return (
		<div className="flex h-[420px] w-[500px] flex-col flex-col justify-between gap-4 rounded-2xl border-1 border-gray-100 p-8 shadow-lg md:w-[700px] dark:border-gray-900">
			<Messages />
		</div>
	)
}
