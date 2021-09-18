import { createContext } from 'react'
import { RootStore } from './store'

// thanks typescript
export const StoreContext = createContext<RootStore>({} as RootStore)
