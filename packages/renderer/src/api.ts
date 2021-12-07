import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import i18n from 'i18next'

const instance = rateLimit(axios.create({ baseURL: 'https://api.vk.com' }), {
  maxRPS: 3,
})

type VKApiResponse<T> = {
  response: T
}

type VKApiError = {
  error: {
    error_code: number
    error_msg: string
    request_params: Array<{ key: string; value: string }>
  }
}

type VKApiData<T> = VKApiResponse<T> | VKApiError

export class Api {
  private token = ''
  v = '5.157'
  lang = i18n.language.split('-')[0]

  setToken(token: string): void {
    this.token = token
  }

  async call<T, R = Record<string, string | number>>(
    method: string,
    params?: R,
  ): Promise<T> {
    const { v, lang, token } = this
    console.log('CALL', method, params)

    const completeParams = {
      v,
      lang,
      access_token: token,
      ...params,
    }

    const { data } = await instance.post<VKApiData<T>>(
      `/method/${method}`,
      new URLSearchParams(completeParams).toString(),
    )

    console.log(method, data)

    if ('response' in data) {
      return data.response
    }

    // TODO: А что с ошибками execute?
    throw data.error
  }
}
