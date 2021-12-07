import { HasHumanName, HasName } from './get-initials'

export const getName = (data?: HasName | HasHumanName) => {
  if (!data) return ''

  if ('first_name' in data) {
    return `${data.first_name} ${data.last_name}`
  }

  return data.name
}
