// Вырвано целиком из https://stackoverflow.com/a/9461657
export const numberFormatter = (num: number | undefined) =>
  num
    ? Math.abs(num) > 999
      ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'k'
      : Math.sign(num) * Math.abs(num)
    : undefined
