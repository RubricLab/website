import { Toaster as SonnerToaster } from 'sonner'

export const Toaster = () => {
	return (
		<SonnerToaster
			position="bottom-center"
			offset={20 + 40 + 20}
			expand
			toastOptions={{
				classNames: {
					toast:
						'!rounded !border-subtle !rounded-full !min-h-12 !py-2 !px-3.5 !bg-background !text-primary',
					title: '!font-normal',
					description: '!font-light'
				}
			}}
		/>
	)
}
