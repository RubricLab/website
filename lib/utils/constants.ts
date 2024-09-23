export const isDev = process.env.NODE_ENV === "development";
export const isClient = typeof window !== 'undefined'
export const RESIZE_DEBOUNCE = 100