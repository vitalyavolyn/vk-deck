import { createContext } from 'react'
import { ApiStore } from './api-store'

// TODO: export RootStore
// thanks typescript
export const StoreContext = createContext<ApiStore>({} as ApiStore)
