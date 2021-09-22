import { makeAutoObservable } from 'mobx'
import {
  GroupsGroupFull,
  UsersUserXtrCounters,
} from '@vkontakte/api-schema-typescript'
import { Api } from '../api'
import { RootStore } from './root-store'

interface UserData {
  user: UsersUserXtrCounters
  managedGroups: GroupsGroupFull[]
}

export class ApiStore {
  token = ''
  userData: UserData = {} as UserData // в местах, где используется, он будет (честно)
  api = new Api()

  get isAuthorized (): boolean {
    return !!this.token && !!this.userData.user?.id
  }

  setToken (token: string): void {
    this.token = token
    this.api.setToken(token)
    this.fetchUser()
    localStorage.setItem('token', token)
  }

  async fetchUser (): Promise<void> {
    // TODO: catch error
    this.userData = await this.api.call<UserData>('execute.init')
  }

  constructor (public root: RootStore) {
    const token = localStorage.getItem('token')
    if (token) {
      this.setToken(token)
    }

    makeAutoObservable(this)
  }
}
