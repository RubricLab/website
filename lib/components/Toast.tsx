'use client'
import { toast as SonnerToast, Toaster as SonnerToaster } from 'sonner'

/**
 * Usage: simply import `toast` and call `toast.success("Your text")` in your component.
 */
export const Toaster = () => {
	return <SonnerToaster />
}

export const toast = SonnerToast
