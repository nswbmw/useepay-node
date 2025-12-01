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
  }

  // https://openapi-useepay.apifox.cn/doc-1987912#md5%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B
  async _genMD5Sign (payload) {
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
    return md5(str)
  }

  // https://openapi-useepay.apifox.cn/doc-1987912#rsa%E7%AD%BE%E5%90%8D%E7%94%9F%E6%88%90%E7%A4%BA%E4%BE%8B
  async _genRSASign (payload) {
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

    const key = await importPrivateKey(this.signKey)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(str)

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      dataBuffer
    )

    const bytes = new Uint8Array(signature)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  _getURL (url) {
    url = url.replace(/^\//, '')
    return (this.environment === 'sandbox')
      ? `https://pay-gateway1.uat.useepay.com/${url}`
      : `https://pay-gateway.useepay.com/${url}`
  }

  async execute ({ method = 'GET', url, headers = {}, body }) {
    const fetchOptions = {
      method,
      headers: Object.assign({
        'Content-Type': 'application/x-www-form-urlencoded'
      }, headers)
    }

    if (body) {
      body.signType = this.signType

      if (this.signType === 'MD5') {
        body.sign = await this._genMD5Sign(body)
      } else {
        body.sign = await this._genRSASign(body)
      }

      fetchOptions.body = new URLSearchParams(body)
    }

    const response = await fetch(this._getURL(url), fetchOptions)

    const json = await response.json()

    return json
  }
}

async function importPrivateKey (pem) {
  const pemBody = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '')

  const binaryDerString = atob(pemBody)
  const binaryDer = new Uint8Array(binaryDerString.length)
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i)
  }

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )
}

async function md5 (message) {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(message)

  const digest = await crypto.subtle.digest({ name: 'MD5' }, buffer)
  const hash = Array.from(new Uint8Array(digest))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')

  return hash
}

export default UseePay
