// Filter / sort / summary / percentile logic shared by the dashboard iterations.
// Ported from /tmp/iter-improve/demo2-perf/src/transactions.ts. The naive O(n^2)
// percentile is kept deliberately so iteration 1 is genuinely slow.

import type { Transaction } from './data'

export type SortKey = 'date' | 'amount' | 'description' | 'category'
export type SortDir = 'asc' | 'desc'

export interface Summary {
	count: number
	total: number // net (sum of signed amounts)
	income: number // sum of positive amounts
	expense: number // sum of negative amounts (negative number)
	avgAbs: number // average of absolute amounts
	byCategory: Record<string, number> // net per category
}

export function filterTransactions(txns: Transaction[], query: string): Transaction[] {
	const q = query.trim().toLowerCase()
	if (!q) return txns
	return txns.filter(
		t =>
			t.description.toLowerCase().includes(q) ||
			t.category.toLowerCase().includes(q) ||
			t.merchant.toLowerCase().includes(q)
	)
}

export function sortTransactions(txns: Transaction[], key: SortKey, dir: SortDir): Transaction[] {
	const factor = dir === 'asc' ? 1 : -1
	// copy so we never mutate the input
	const copy = txns.slice()
	copy.sort((a, b) => {
		let cmp: number
		switch (key) {
			case 'amount':
				cmp = a.amount - b.amount
				break
			case 'date':
				cmp = a.date < b.date ? -1 : a.date > b.date ? 1 : 0
				break
			case 'description':
				cmp = a.description < b.description ? -1 : a.description > b.description ? 1 : 0
				break
			case 'category':
				cmp = a.category < b.category ? -1 : a.category > b.category ? 1 : 0
				break
		}
		if (cmp === 0) cmp = a.id - b.id // stable tiebreak
		return cmp * factor
	})
	return copy
}

export function computeSummary(txns: Transaction[]): Summary {
	let total = 0
	let income = 0
	let expense = 0
	let absSum = 0
	const byCategory: Record<string, number> = {}
	for (const t of txns) {
		total += t.amount
		if (t.amount >= 0) income += t.amount
		else expense += t.amount
		absSum += Math.abs(t.amount)
		byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount
	}
	// round to cents to avoid float drift
	const r = (n: number) => Math.round(n * 100) / 100
	for (const k of Object.keys(byCategory)) byCategory[k] = r(byCategory[k]!)
	return {
		avgAbs: txns.length ? r(absSum / txns.length) : 0,
		byCategory,
		count: txns.length,
		expense: r(expense),
		income: r(income),
		total: r(total)
	}
}

/**
 * Percentile rank of each transaction's absolute amount within the set:
 * fraction of rows with a strictly smaller |amount|, rounded to whole percent.
 * NAIVE O(n^2): for every row, scan every other row.
 */
export function computePercentilesNaive(txns: Transaction[]): Map<number, number> {
	const out = new Map<number, number>()
	const n = txns.length
	for (let i = 0; i < n; i++) {
		const ti = txns[i]!
		const ai = Math.abs(ti.amount)
		let less = 0
		for (let j = 0; j < n; j++) {
			if (Math.abs(txns[j]!.amount) < ai) less++
		}
		out.set(ti.id, n ? Math.round((less / n) * 100) : 0)
	}
	return out
}

/**
 * Same result as computePercentilesNaive but O(n log n): sort the absolute
 * amounts once, then binary-search the count of strictly-smaller values.
 */
export function computePercentilesFast(txns: Transaction[]): Map<number, number> {
	const n = txns.length
	const amounts = new Float64Array(n)
	for (let i = 0; i < n; i++) amounts[i] = Math.abs(txns[i]!.amount)
	const sorted = Array.from(amounts).sort((a, b) => a - b)
	// lowerBound: index of first element >= x === count of elements strictly < x
	const lowerBound = (x: number): number => {
		let lo = 0
		let hi = n
		while (lo < hi) {
			const mid = (lo + hi) >>> 1
			if (sorted[mid]! < x) lo = mid + 1
			else hi = mid
		}
		return lo
	}
	const out = new Map<number, number>()
	for (let i = 0; i < n; i++) {
		const less = lowerBound(amounts[i]!)
		out.set(txns[i]!.id, n ? Math.round((less / n) * 100) : 0)
	}
	return out
}
