import {
  GroupsGroupFull,
  UsersUserFull,
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
  settings: string
}

export class ApiStore {
  token = ''
  initData: UserData = {} as UserData // в местах, где используется, он будет (честно)
  api = new Api()
  profiles: Record<number, UsersUserFull> = {}
  groups: Record<number, GroupsGroupFull> = {}

  get isAuthorized(): boolean {
    return !!this.token && !!this.initData.user?.id
  }

  async setToken(token: string): Promise<void> {
    this.token = token
    this.api.setToken(token)
    await this.fetchUser()
    localStorage.setItem('token', token)
    if (this.initData.settings) {
      this.root.settingsStore.load({ columns: JSON.parse(this.initData.settings) })
    }
  }

  async fetchUser(): Promise<void> {
    // TODO: catch error
    this.initData = await this.api.call<UserData>('execute.init')
  }

  constructor(public root: RootStore) {
    const token = localStorage.getItem('token')
    if (token) {
      this.setToken(token)
    }

    makeAutoObservable(this)

    this.getOwner = this.getOwner.bind(this)
  }

  add(type: 'profiles', profiles?: UsersUserFull[]): void
  add(type: 'groups', groups?: GroupsGroupFull[]): void
  add(type: 'profiles' | 'groups', arr: (UsersUserFull | GroupsGroupFull)[] = []) {
    Object.assign(this[type], Object.fromEntries(arr.map((e) => [e.id, e])))
  }

  getOwner(id: number) {
    if (id === -114503206) {
      console.log(this.groups)
    }
    return id > 0 ? this.profiles[id] : this.groups[-id]
  }
}
