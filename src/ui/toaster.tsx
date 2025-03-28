import { Toaster as SonnerToaster } from 'sonner'
import { Checkmark } from './icons/checkmark'

export const Toaster = () => {
	return (
		<SonnerToaster
			position="bottom-center"
			offset={20 + 40 + 20}
			expand
			icons={{
				success: <Checkmark className="size-4" />
			}}
			toastOptions={{
				classNames: {
					toast:
						'!rounded !border-subtle !rounded-full !min-h-12 !py-2 !px-4 !bg-background !text-primary',
					title: '!font-normal',
					description: '!font-light',
					icon: '!w-fit'
				}
			}}
		/>
	)
}
