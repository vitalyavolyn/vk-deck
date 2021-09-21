import { makeAutoObservable } from 'mobx'
import { UsersGetParams, UsersGetResponse, UsersUserXtrCounters } from '@vkontakte/api-schema-typescript'
import { Api } from '../api'
import { RootStore } from './root-store'

export class ApiStore {
  token = ''
  user: UsersUserXtrCounters = {} as UsersUserXtrCounters // в местах, где используется, он будет (честно)
  api = new Api()

  get isAuthorized (): boolean {
    return !!this.token && !!this.user.id
  }

  setToken (token: string): void {
    this.token = token
    this.api.setToken(token)
    this.fetchUser()
    localStorage.setItem('token', token)
  }

  async fetchUser (): Promise<void> {
    // TODO: catch error
    const [user] = await this.api.call<UsersGetResponse, UsersGetParams>('users.get', {
      fields: 'photo_50',
    })

    this.user = user
  }

  constructor (public root: RootStore) {
    const token = localStorage.getItem('token')
    if (token) {
      this.setToken(token)
    }

    makeAutoObservable(this)
  }
}
