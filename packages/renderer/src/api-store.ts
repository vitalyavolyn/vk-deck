import { makeAutoObservable } from 'mobx'
import { UsersGetParams, UsersGetResponse, UsersUserXtrCounters } from '@vkontakte/api-schema-typescript'
import { Api } from './api'

export class ApiStore {
  token = ''
  user: UsersUserXtrCounters = {} as UsersUserXtrCounters // все равно в местах, где используется, он будет
  api = new Api()

  get isAuthorized (): boolean {
    return !!this.token
  }

  setToken (token: string): void {
    this.token = token
    this.api.setToken(token)
    this.fetchUser()
    localStorage.setItem('token', token)
  }

  async fetchUser (): Promise<void> {
    const [user] = await this.api.call<UsersGetResponse, UsersGetParams>('users.get', {
      fields: 'photo_50'
    })

    this.user = user
  }

  constructor () {
    const token = localStorage.getItem('token')
    if (token) {
      this.setToken(token)
    }

    makeAutoObservable(this)
  }
}
