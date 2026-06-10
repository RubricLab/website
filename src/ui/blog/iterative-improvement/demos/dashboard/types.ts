import type { Transaction } from './data'

// Contract every iteration column implements. The parent mounts one of these on
// "Run" and feeds back the real mount + filter latency through the callbacks.
export interface IterDashboardProps {
	data: Transaction[]
	mountStart: number
	onMount: (ms: number) => void
	onFilter: (ms: number) => void
}
