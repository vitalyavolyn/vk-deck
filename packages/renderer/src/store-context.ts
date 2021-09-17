import { createContext } from 'react'
import { ApiStore } from './api-store'

// thanks typescript
export const storeContext = createContext<ApiStore>({} as ApiStore)
