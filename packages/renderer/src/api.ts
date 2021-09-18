import axios from 'axios'
import rateLimit from 'axios-rate-limit'

const instance = rateLimit(
  axios.create({ baseURL: 'https://api.vk.com' }),
  { maxRPS: 3 },
)

export class Api {
  private token = ''
  v = '5.131'
  // TODO: get from i18next
  lang = navigator.language.split('-')[0]

  setToken (token: string): void {
    this.token = token
  }

  async call <T, R = Record<string, string | number>> (method: string, params: R): Promise<T> {
    const { v, lang, token } = this
    console.log('CALL', method, params)
    params = {
      v,
      lang,
      access_token: token,
      ...params,
    }

    return instance
      // TODO:
      // @ts-ignore: я либо сдамся и params будет Record<string, string>, либо так
      .post(`/method/${method}`, new URLSearchParams(params).toString())
      .then(({ data }) => {
        if (data.response) {
          return data.response
        } else {
          // TODO: execute??
          throw data.error
        }
      })
      // TODO: catch
  }
}
