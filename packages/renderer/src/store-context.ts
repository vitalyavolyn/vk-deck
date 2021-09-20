import { createContext } from 'react'
import { RootStore } from './store/root-store'

// thanks typescript
export const StoreContext = createContext<RootStore>({} as RootStore)
