import { useAppStore } from '@/context/use-app-store'

export const useDebug = () => {
  const debug = useAppStore(state => state.debug)
  return debug
}
