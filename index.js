const crypto = require('crypto')
const request = require('request-promise')
const HttpsProxyAgent = require('https-proxy-agent')
const { SocksProxyAgent } = require('socks-proxy-agent')
const NodeRSA = require('node-rsa')

function UseePay (options = {}) {
  this.environment = options.environment || 'sandbox'
  this.signType = options.signType
  this.signKey = options.signKey

  if (!this.signType) {
    throw new Error('No signType')
  }
  if (!['MD5', 'RSA'].includes(this.signType)) {
    throw new Error('Wrong signType: MD5 or RDA')
  }
  if (!this.signKey) {
    throw new Error('No signKey')
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
        throw new Error('proxy.protocol must be one of ["http", "socks"]')
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

  return this
}

// https://openapi-useepay.apifox.cn/doc-1987912#md5%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B
UseePay.prototype._genMD5Sign = function (payload) {
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
UseePay.prototype._genRSASign = function (payload) {
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

UseePay.prototype._getURL = function (url) {
  if (!url.startsWith('/')) {
    return url
  }
  url = url.replace(/^\//, '')
  return (this.environment === 'sandbox')
    ? `https://pay-gateway1.uat.useepay.com/${url}`
    : `https://pay-gateway.useepay.com/${url}`
}

UseePay.prototype.execute = async function ({ method = 'get', url, headers = {}, form }) {
  const payload = {
    method,
    url: this._getURL(url),
    headers,
    agent: this.agent,
    json: true
  }

  if (form) {
    form.signType = this.signType

    if (this.signType === 'MD5') {
      form.sign = this._genMD5Sign(form)
    } else {
      form.sign = this._genRSASign(form)
    }

    payload.form = form
  }

  return request(payload)
}

module.exports = UseePay
