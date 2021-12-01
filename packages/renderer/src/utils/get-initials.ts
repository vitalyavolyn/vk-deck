interface HasName {
  name: string
}

interface HasHumanName {
  first_name: string
  last_name: string
}

export const getInitials = (data: HasName | HasHumanName | string) => {
  if (typeof data === 'string') {
    data = { name: data }
  }

  if ('first_name' in data) {
    return `${data.first_name[0]}${data.last_name[0]}`
  }

  // если группа или просто текст, то пытаемся сделать по-умному
  const [first, second] = data.name.split(' ')
  return second ? `${first[0]}${second[0]}` : data.name.slice(0, 2)
}
