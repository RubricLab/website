'use client'
import { motion } from 'framer-motion'

type FadeInProps = {
	children: React.ReactNode
	delay?: number
	className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ amount: 0.1, once: true }}
			transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	)
}
