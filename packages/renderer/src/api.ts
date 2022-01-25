import { decode } from '@msgpack/msgpack'
import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import i18next from 'i18next'
import _ from 'lodash'

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
  useMsgpack = false
  v = '5.173'
  lang = i18next.language.split('-')[0]

  setToken(token: string): void {
    this.token = token
  }

  get isReady() {
    return !!this.token
  }

  async call<T, R extends object = Record<string, string | number>>(
    method: string,
    params?: R,
  ): Promise<T> {
    const { v, lang, token, useMsgpack } = this

    console.log('CALL', method, params)

    const completeParams = {
      v,
      lang,
      access_token: token,
      ..._.pickBy(params, (v) => v !== undefined),
    }

    let { data } = await instance.post<VKApiData<T> | ArrayBuffer>(
      `/method/${method}` + (useMsgpack ? '.msgpack' : ''),
      new URLSearchParams(completeParams).toString(),
      { responseType: useMsgpack ? 'arraybuffer' : 'json' },
    )

    if (data instanceof ArrayBuffer) {
      data = decode(data) as VKApiData<T>
    }

    console.log(method, data)

    if ('response' in data) {
      return data.response
    }

    // TODO: А что с ошибками execute?
    throw data.error
  }
}
