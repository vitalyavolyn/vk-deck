import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import i18n from 'i18next'

const instance = rateLimit(
  axios.create({ baseURL: 'https://api.vk.com' }),
  { maxRPS: 3 },
)

export class Api {
  private token = ''
  v = '5.131'
  lang = i18n.language.split('-')[0]

  setToken (token: string): void {
    this.token = token
  }

  async call <T, R = Record<string, string | number>> (method: string, params?: R): Promise<T> {
    const { v, lang, token } = this
    console.log('CALL', method, params)

    const completeParams = {
      v,
      lang,
      access_token: token,
      ...params,
    }

    return instance
      .post(`/method/${method}`, new URLSearchParams(completeParams).toString())
      .then(({ data }) => {
        console.log(data)
        if (data.response) {
          return data.response
        } else {
          // TODO: execute??
          throw data.error
        }
      })
  }
}
