import { autorun, makeAutoObservable } from 'mobx'
import { RootStore } from './root-store'

export type ColorScheme = 'auto' | 'light' | 'dark'

export interface Settings {
  colorScheme: ColorScheme
  columns: Column[]
}

export type ColumnType = 'test'

export interface Column {
  type: ColumnType
  id: string
}

export class SettingsStore implements Settings {
  colorScheme: ColorScheme = 'auto'
  columns: Column[] = []

  constructor(public root: RootStore) {
    const json = localStorage.getItem('settings') || '{}'
    // TODO: ловить ошибки парсинга
    this.load(JSON.parse(json))

    makeAutoObservable(this)

    autorun(() => {
      localStorage.setItem('settings', JSON.stringify(this.asObject))
    })
  }

  get asObject(): Settings {
    return {
      colorScheme: this.colorScheme,
      columns: this.columns,
    }
  }

  load(settings: Settings) {
    Object.assign(this, settings)
  }

  getColumn(columnId: string): Column {
    const col = this.columns.find((e) => e.id === columnId)
    if (!col) throw new Error('Unknown column id - ' + columnId)
    return col
  }
}
