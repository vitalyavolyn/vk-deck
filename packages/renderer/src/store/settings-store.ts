import { autorun, makeAutoObservable } from 'mobx'
import { NewsfeedColumnSettings } from '@/components/columns/newsfeed-column'
import { WallColumnSettings } from '@/components/columns/wall-column'
import { RootStore } from './root-store'

export type ColorScheme = 'auto' | 'light' | 'dark'

export enum ColumnType {
  newsfeed = 'newsfeed',
  test = 'test',
  wall = 'wall',
}

export interface Settings {
  colorScheme: ColorScheme
  columns: Column[]
  columnSize: ColumnSize
  blurAds: boolean
}

export interface BaseColumn {
  id: string
  type: ColumnType
}

export interface INewsfeedColumn extends BaseColumn {
  type: ColumnType.newsfeed
  settings: NewsfeedColumnSettings
}

export interface IWallColumn extends BaseColumn {
  type: ColumnType.wall
  settings: WallColumnSettings
}

// TODO: че с названиями то
export interface SerializedTestColumn extends BaseColumn {
  type: ColumnType.test
}

export type Column = INewsfeedColumn | SerializedTestColumn | IWallColumn

export enum ColumnSize {
  narrow,
  medium,
  wide,
}

export class SettingsStore implements Settings {
  colorScheme: ColorScheme = 'auto'
  columns: Column[] = []
  columnSize: ColumnSize = ColumnSize.medium
  blurAds = false

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
      columnSize: this.columnSize,
      blurAds: this.blurAds,
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
