import { createContext, useContext } from 'react'
import { once } from 'lodash'

export const createColumnContext = once(<C>() => createContext({} as C))
export const useColumn = <C>(): C => useContext(createColumnContext())
