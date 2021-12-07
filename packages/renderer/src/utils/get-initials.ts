import { getName } from '@/utils/get-name'

export interface HasName {
  name: string
}

export interface HasHumanName {
  first_name: string
  last_name: string
}

export const getInitials = (data: HasName | HasHumanName | string) => {
  if (typeof data === 'string') {
    data = { name: data }
  }

  const name = getName(data)
  const [first, second] = name.split(' ')
  return second ? `${first[0]}${second[0]}` : name.slice(0, 2)
}
