export const numberFormatter = (num: number | undefined) => {
  if (!num) return undefined

  const abs = Math.abs(num)
  const sign = Math.sign(num)

  if (abs > 999_999) {
    return sign * Number((abs / 1000000).toFixed(2)) + 'm'
  }

  if (abs > 999) {
    return sign * Number((abs / 1000).toFixed(1)) + 'k'
  }

  return num
}
