import { useContext } from 'react'
import { StoreContext } from '../store-context'
import { RootStore } from '../store'

export const useStore = (): RootStore => useContext(StoreContext)
