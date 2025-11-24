export type ProxyOptions =
  | string
  | {
      protocol: 'http' | 'socks'
      host: string
      port: number
      username?: string
      password?: string
    }

export interface UseePayInitOptions {
  environment?: 'sandbox' | 'production'
  signType: 'MD5' | 'RSA'
  signKey: string
  proxy?: ProxyOptions
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

export interface ExecuteOptions {
  method?: HttpMethod
  url: string
  headers?: Record<string, string | number | boolean>
  body?: any
}

export default class UseePay {
  constructor (options: UseePayInitOptions)
  execute<T = any> (options: ExecuteOptions): Promise<T>
}
