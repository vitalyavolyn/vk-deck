import { GroupsGroupFull, UsersUserFull } from '@vkontakte/api-schema-typescript'
import _ from 'lodash'

export const getOwner = (id: number, profiles: UsersUserFull[], groups: GroupsGroupFull[]) =>
  id > 0 ? _.find(profiles, { id }) : _.find(groups, { id: -id })
