import {
  GroupsGroupFull,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'

export const getInitials = (data: UsersUserFull | GroupsGroupFull) => {
  if ('first_name' in data) {
    return `${data.first_name[0]}${data.last_name[0]}`
  }

  // если группа, то пытаемся сделать по-умному
  const [first, second] = data.name.split(' ')
  return second ? `${first[0]}${second[0]}` : data.name.slice(0, 2)
}
