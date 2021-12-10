import { createContext, useContext } from 'react'
import { once } from 'lodash'

// TODO: возможно, регистрацию функции для обновления
//  контента можно запихнуть сюда же, в контекст
export const createColumnContext = once(<C>() => createContext({} as C))
export const useColumn = <C>(): C => useContext(createColumnContext())
