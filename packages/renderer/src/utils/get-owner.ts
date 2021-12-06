import {
  GroupsGroupFull,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'

export const getOwner = (
  id: number,
  profiles: UsersUserFull[],
  groups: GroupsGroupFull[],
) =>
  id > 0
    ? profiles.find((e) => e.id === id)
    : groups.find((value) => -value.id === id)
