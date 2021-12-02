import { autorun, makeAutoObservable } from 'mobx'
import { RootStore } from './root-store'
import { NewsfeedColumnSettings } from '@/components/columns/newsfeed-column'

export type ColorScheme = 'auto' | 'light' | 'dark'

export interface Settings {
  colorScheme: ColorScheme
  columns: Column[]
}

export interface BaseColumn {
  id: string
  type: ColumnType
}

export interface INewsfeedColumn extends BaseColumn {
  type: 'newsfeed'
  settings: NewsfeedColumnSettings
}

export interface ITestColumn extends BaseColumn {
  type: 'test'
}

export type Column = INewsfeedColumn | ITestColumn
export type ColumnType = Column['type']

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

  getColumn<C extends BaseColumn = BaseColumn>(columnId: string): C {
    const col = this.columns.find((e) => e.id === columnId)
    if (!col) throw new Error('Unknown column id - ' + columnId)
    return col as C
  }
}
