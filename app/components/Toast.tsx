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
					<div className='center w-fit gap-4 rounded-full border-2 border-stone-300/80 bg-stone-100 p-4 pr-6 shadow-2xl'>
						<ToastIcon toast={toast} />
						{resolveValue(toast.message, toast)}
					</div>
				</>
			)}
		</Toaster>
	)
}

export const toast = reactHotToast
