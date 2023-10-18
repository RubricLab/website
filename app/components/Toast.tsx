'use client'

import {
	Toast,
	ToastIcon,
	Toaster,
	toast as reactHotToast,
	resolveValue
} from 'react-hot-toast'

/**
 * Usage: simply import `toast` and call `toast.success("Your text")` in your component.
 */
export const ToastProvider = () => {
	return (
		<Toaster position='bottom-left'>
			{(toast: Toast) => (
				<>
					<div className='center flex w-fit gap-4 rounded-full border-2 border-stone-300/80 bg-stone-100 p-4 pr-6 shadow-2xl dark:border-stone-950/80 dark:bg-stone-700'>
						<ToastIcon toast={toast} />
						<p>{resolveValue(toast.message, toast)}</p>
					</div>
				</>
			)}
		</Toaster>
	)
}

export const toast = reactHotToast
