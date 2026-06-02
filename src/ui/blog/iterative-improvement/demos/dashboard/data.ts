// Deterministic seeded dataset shared by all three dashboard iterations, so the
// naive / memoized / virtualized columns are compared on identical input.
// Ported from /tmp/iter-improve/demo2-perf/src/data.ts.

export interface Transaction {
	id: number
	date: string // ISO yyyy-mm-dd
	description: string
	category: string
	merchant: string
	amount: number // signed: negative = debit, positive = credit
}

export const CATEGORIES = [
	'Groceries',
	'Dining',
	'Transport',
	'Utilities',
	'Entertainment',
	'Health',
	'Travel',
	'Income',
	'Shopping',
	'Rent'
]

const MERCHANTS = [
	'Acme Foods',
	'Metro Transit',
	'PowerCo',
	'Streamly',
	'MediCare Plus',
	'SkyJet',
	'Globex Payroll',
	'ShopMart',
	'Brick Properties',
	'Cafe Luna'
]

// Small deterministic PRNG (mulberry32) so data is identical across runs, which
// keeps the side-by-side comparison fair.
function mulberry32(seed: number): () => number {
	let a = seed >>> 0
	return () => {
		a |= 0
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export function generateTransactions(count: number, seed = 42): Transaction[] {
	const rand = mulberry32(seed)
	const out: Transaction[] = new Array(count)
	const startDate = Date.UTC(2023, 0, 1)
	const dayMs = 86400000
	for (let i = 0; i < count; i++) {
		const catIdx = Math.floor(rand() * CATEGORIES.length)
		const category = CATEGORIES[catIdx]!
		const merchant = MERCHANTS[catIdx]!
		const isIncome = category === 'Income'
		const magnitude = Math.round((rand() * 980 + 5) * 100) / 100
		const amount = isIncome ? magnitude : -magnitude
		const dayOffset = Math.floor(rand() * 730)
		const date = new Date(startDate + dayOffset * dayMs).toISOString().slice(0, 10)
		out[i] = {
			amount,
			category,
			date,
			description: `${merchant} #${i} ${category}`,
			id: i,
			merchant
		}
	}
	return out
}

// Lazily generated 10k-row singleton, shared by every column so the comparison
// is fair and the data is only built once on the client.
let cached: Transaction[] | null = null
export function getTransactions(): Transaction[] {
	if (cached === null) cached = generateTransactions(10000)
	return cached
}
