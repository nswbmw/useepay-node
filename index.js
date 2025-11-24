import crypto from 'node:crypto'

import request from 'lite-request'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import NodeRSA from 'node-rsa'

class UseePay {
  constructor (options = {}) {
    this.environment = options.environment || 'sandbox'
    this.signType = options.signType || options.sign_type
    this.signKey = options.signKey || options.sign_key

    if (!this.signType) {
      throw new TypeError('No signType')
    }
    if (!['MD5', 'RSA'].includes(this.signType)) {
      throw new TypeError('Wrong signType: MD5 or RSA')
    }
    if (!this.signKey) {
      throw new TypeError('No signKey')
    }

    const proxy = options.proxy
    if (proxy) {
      if (typeof proxy === 'string') {
        if (proxy.startsWith('http://')) {
          this.agent = new HttpsProxyAgent(proxy)
        } else if (proxy.startsWith('socks://')) {
          this.agent = new SocksProxyAgent(proxy)
        }
      } else if (typeof proxy === 'object') {
        if (!['http', 'socks'].includes(proxy.protocol)) {
          throw new TypeError('proxy.protocol must be one of ["http", "socks"]')
        }
        this.agent = (proxy.protocol === 'http')
          ? new HttpsProxyAgent((proxy.username && proxy.password)
            ? `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
            : `http://${proxy.host}:${proxy.port}`
          )
          : new SocksProxyAgent((proxy.username && proxy.password)
            ? `socks://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
            : `socks://${proxy.host}:${proxy.port}`
          )
      }
    }
  }

  // https://openapi-useepay.apifox.cn/doc-1987912#md5%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B
  _genMD5Sign (payload) {
    const data = Object.keys(payload)
      .sort()
      .reduce((obj, key) => {
        obj[key] = payload[key]
        return obj
      }, {})
    let str = ''
    Object.keys(data).forEach((key) => {
      if (data[key] !== '' && key !== 'sign') {
        str = str + key + '=' + data[key] + '&'
      }
    })
    str = str + 'pkey=' + this.signKey
    return crypto.createHash('md5').update(str).digest('hex')
  }

  // https://openapi-useepay.apifox.cn/doc-1987912#rsa%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B
  _genRSASign (payload) {
    const data = Object.keys(payload)
      .sort()
      .reduce((obj, key) => {
        obj[key] = payload[key]
        return obj
      }, {})
    let str = ''
    Object.keys(data).forEach((key) => {
      if (data[key] !== '' && key !== 'sign') {
        str = str + key + '=' + data[key] + '&'
      }
    })
    str = str.substr(0, str.length - 1)
    return new NodeRSA(this.signKey, 'pkcs8-private').sign(
      Buffer.from(str),
      'base64'
    )
  }

  _getURL (url) {
    url = url.replace(/^\//, '')
    return (this.environment === 'sandbox')
      ? `https://pay-gateway1.uat.useepay.com/${url}`
      : `https://pay-gateway.useepay.com/${url}`
  }

  async execute ({ method = 'GET', url, headers = {}, body }) {
    const payload = {
      method,
      url: this._getURL(url),
      headers,
      agent: this.agent,
      json: true
    }

    if (body) {
      body.signType = this.signType

      if (this.signType === 'MD5') {
        body.sign = this._genMD5Sign(body)
      } else {
        body.sign = this._genRSASign(body)
      }

      payload.form = body
    }

    const response = await request(payload)

    return response.data
  }
}

export default UseePay
