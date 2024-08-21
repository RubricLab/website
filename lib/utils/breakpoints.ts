export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const breakpoints = {
  sm: {min: 640, max: 767, value: '640px'},
  md: {min: 768, max: 1023, value: '768px'},
  lg: {min: 1024, max: 1279, value: '1024px'},
  xl: {min: 1280, max: 1535, value: '1280px'},
  '2xl': {min: 1536, max: Infinity, value: '1536px'}
}
