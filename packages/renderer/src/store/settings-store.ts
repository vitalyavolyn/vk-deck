import { autorun, makeAutoObservable } from 'mobx'
import { RootStore } from './root-store'

export type ColorScheme = 'auto' | 'light' | 'dark'

export interface Settings {
  colorScheme: ColorScheme
}

export class SettingsStore implements Settings {
  colorScheme: ColorScheme = 'auto'

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
    }
  }

  load(settings: Settings) {
    Object.assign(this, settings)
  }
}
