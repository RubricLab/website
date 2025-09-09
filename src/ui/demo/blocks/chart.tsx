import { useMemo } from 'react'
import { Area, Line, LineChart, ReferenceDot, ResponsiveContainer } from 'recharts'

export type ChartData = { name: string; value: number }[]

export function Chart({ data }: { data: ChartData }) {
	const nf = new Intl.NumberFormat()
	const maxIndex = useMemo(() => {
		if (!data || data.length === 0) return -1
		let idx = 0
		let max = data[0]?.value ?? 0
		for (let i = 1; i < data.length; i++) {
			const v = data[i]?.value ?? 0
			if (v > max) {
				max = v
				idx = i
			}
		}
		return idx
	}, [data])
	const peak = maxIndex >= 0 ? data[maxIndex] : undefined

	return (
		<div className="w-full rounded-md border-1 border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-transparent">
			<div className="mb-1 flex items-center justify-between">
				<div className="text-gray-500 text-xs dark:text-gray-400">Visitors</div>
				{peak ? (
					<div className="rounded-full border-1 border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 dark:border-gray-800 dark:bg-transparent dark:text-gray-400">
						Peak {nf.format(peak.value)} at {peak.name}
					</div>
				) : null}
			</div>
			<div className="h-20">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<Area type="monotone" dataKey="value" fill="#E5E7EB" stroke="none" />
						<Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
						{peak ? (
							<>
								<ReferenceDot x={peak.name} y={peak.value} r={6} fill="#3B82F6" fillOpacity={0.15} />
								<ReferenceDot x={peak.name} y={peak.value} r={3.5} fill="#3B82F6" />
							</>
						) : null}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
