'use client'

import { useDebug } from '@/hooks/use-debug'
import { Portal } from '@radix-ui/react-portal'
import { Leva as LevaPanel } from 'leva'
import { Suspense } from 'react'

export const Leva = () => {
	const debug = useDebug()

	return (
		<Suspense>
			<Portal>
				<LevaPanel
					theme={{
						space: {
							xs: '0px',
							sm: '5px',
							md: '10px',
							colGap: '2px',
							rowGap: '2px'
						},
						sizes: {
							rootWidth: '350px'
						}
					}}
					flat
					collapsed
					hidden={!debug}
				/>
			</Portal>
		</Suspense>
	)
}
