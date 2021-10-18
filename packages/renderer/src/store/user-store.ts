import { makeAutoObservable } from 'mobx'
import {
  GroupsGroupFull,
  UsersUserXtrCounters,
} from '@vkontakte/api-schema-typescript'
import { RootStore } from './root-store'
import { Api } from '@/api'

interface UserData {
  user: UsersUserXtrCounters
  managedGroups: GroupsGroupFull[]
}

export class UserStore {
  token = ''
  data: UserData = {} as UserData // в местах, где используется, он будет (честно)
  api = new Api()

  get isAuthorized(): boolean {
    return !!this.token && !!this.data.user?.id
  }

  async setToken(token: string): Promise<void> {
    this.token = token
    this.api.setToken(token)
    await this.fetchUser()
    localStorage.setItem('token', token)
  }

  async fetchUser(): Promise<void> {
    // TODO: catch error
    this.data = await this.api.call<UserData>('execute.init')
  }

  constructor(public root: RootStore) {
    const token = localStorage.getItem('token')
    if (token) {
      this.setToken(token)
    }

    makeAutoObservable(this)
  }
}
