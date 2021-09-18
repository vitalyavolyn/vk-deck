import { useContext } from 'react'
import { StoreContext } from '../store-context'
import { ApiStore } from '../api-store'

export const useStore = (): ApiStore => useContext(StoreContext)
