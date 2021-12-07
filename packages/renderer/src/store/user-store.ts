import {
  GroupsGroupFull,
  UsersUserXtrCounters,
} from '@vkontakte/api-schema-typescript'
import { NewsfeedList } from '@vkontakte/api-schema-typescript/dist/objects/newsfeed/NewsfeedList'
import { makeAutoObservable } from 'mobx'
import { Api } from '@/api'
import { RootStore } from './root-store'

interface UserData {
  user: UsersUserXtrCounters
  managedGroups: GroupsGroupFull[]
  newsfeedLists: NewsfeedList[]
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
