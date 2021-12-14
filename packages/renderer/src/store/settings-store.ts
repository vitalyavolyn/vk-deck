import { StorageSetParams, StorageSetResponse } from '@vkontakte/api-schema-typescript'
import _ from 'lodash'
import { autorun, makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { NewsfeedColumnSettings } from '@/components/columns/newsfeed-column'
import { WallColumnSettings } from '@/components/columns/wall-column'
import { RootStore } from './root-store'

export type ColorScheme = 'auto' | 'light' | 'dark'

export enum ColumnType {
  newsfeed = 'newsfeed',
  rick = 'rick',
  wall = 'wall',
  likedPosts = 'likedPosts',
}

export interface Settings {
  colorScheme: ColorScheme
  columns: Column[]
  columnSize: ColumnSize
  blurAds: boolean
  // TODO: возможность настроить размер
  mediaQuickPreview: boolean
}

export interface BaseColumn {
  id: string
  type: ColumnType
}

export enum ImageGridSize {
  badges = 'badges',
  // TODO: small
  medium = 'medium',
  // TODO: large
}

export interface ColumnImageGridSettings {
  imageGridSize: ImageGridSize
}

export interface INewsfeedColumn extends BaseColumn {
  type: ColumnType.newsfeed
  settings: NewsfeedColumnSettings
}

export interface IWallColumn extends BaseColumn {
  type: ColumnType.wall
  settings: WallColumnSettings
}

export interface IRickColumn extends BaseColumn {
  type: ColumnType.rick
}

export interface ILikedPostsColumn extends BaseColumn {
  type: ColumnType.likedPosts
  settings: ColumnImageGridSettings
}

export type Column = INewsfeedColumn | IRickColumn | IWallColumn | ILikedPostsColumn

export enum ColumnSize {
  narrow,
  medium,
  wide,
}

type ColumnRefreshFn = () => void

// пропускаем первый запуск autorun, чтобы случайно не переписать
// данные в API старыми
let columnSaveSkip = true

export class SettingsStore implements Settings {
  colorScheme: ColorScheme = 'auto'
  columns: Column[] = []
  columnSize: ColumnSize = ColumnSize.medium
  blurAds = false
  mediaQuickPreview = true

  // функции для обновления колонок, ключ - id колонки
  columnRefreshFns: Record<string, ColumnRefreshFn> = {}

  // информация о колонках-стенах
  //
  // ownerId: id колонки
  //
  // нужно для того, чтобы можно было быстро проверить,
  // есть ли колонка определенной страницы
  //
  // например, чтобы форсить обновление колонки после
  // появления поста в ленте
  //
  // очень специфично, конечно, но я хотел это сделать
  wallColumns: Record<number, string> = {}

  constructor(public root: RootStore) {
    const json = localStorage.getItem('settings') || '{}'
    // TODO: ловить ошибки парсинга
    this.load(JSON.parse(json))

    makeAutoObservable(this)

    // сохраняет все настройки в localStorage при изменении чего-либо
    autorun(() => {
      localStorage.setItem('settings', JSON.stringify(this.asObject))
    })

    // сохраняет колонки с их настройками в VK API при их изменении
    autorun(() => {
      const { api } = this.root.apiStore

      if (api.isReady && !columnSaveSkip) {
        api.call<StorageSetResponse, StorageSetParams>('storage.set', {
          key: 'columns',
          value: JSON.stringify(this.columns),
        })
      } else {
        // так надо
        console.log(this.columns.toString())
      }

      columnSaveSkip = false
    })

    autorun(() => {
      const cols = _.filter(this.columns, { type: 'wall' }) as IWallColumn[]
      this.wallColumns = Object.fromEntries(cols.map((val) => [val.settings.ownerId, val.id]))
    })
  }

  get asObject(): Settings {
    return {
      colorScheme: this.colorScheme,
      columns: this.columns,
      columnSize: this.columnSize,
      blurAds: this.blurAds,
      mediaQuickPreview: this.mediaQuickPreview,
    }
  }

  load(settings: Partial<Settings>) {
    Object.assign(this, settings)
  }

  getColumn<C extends BaseColumn = BaseColumn>(columnId: string): C {
    const col = _.find(this.columns, { id: columnId })
    if (!col) throw new Error('Unknown column id - ' + columnId)
    return col as C
  }

  /**
   * Меняет местами колонки с индексами from, to
   */
  swapColumns(from: number, to: number) {
    const tmp = this.columns[from]
    this.columns[from] = this.columns[to]
    this.columns[to] = tmp
  }

  refreshColumn(id: string) {
    this.columnRefreshFns[id]?.()
  }

  duplicateColumn(id: string) {
    const index = _.findIndex(this.columns, { id })
    const col = this.columns[index]

    const newCol = {
      ...col,
      id: uuidv4(),
    }

    this.columns.splice(index + 1, 0, newCol)
  }
}
