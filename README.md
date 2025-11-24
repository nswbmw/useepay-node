## useepay

Useepay SDK for Node.js.

### Install

```sh
$ npm i useepay --save
```

### Example

```js
import Useepay from 'useepay'

const useepayClient = new Useepay({
  environment: 'sandbox',
  signType: 'MD5',
  signKey: 'xxx'
})

;(async () => {
  const shippingAddress = {
    email: 'test@gmail.com',
    phoneNo: '123456',
    firstName: 'test',
    lastName: 'test',
    street: 'street',
    postalCode: '123456',
    city: 'test',
    state: 'test',
    country: 'US'
  }
  const res = await useepayClient.execute({
    method: 'POST',
    url: '/cashier',
    body: {
      appId: 'www.innowavetechnologyltd.com',
      amount: 100,
      currency: 'USD',
      merchantNo: '500000000011462',
      autoRedirect: false,
      orderInfo: JSON.stringify({
        subject: 'my test order',
        goodsInfo: [{
          id: 'id',
          name: 'name',
          body: 'body',
          quantity: 1,
          price: 100
        }],
        shippingAddress
      }),
      payerInfo: JSON.stringify({
        paymentMethod: 'credit_card',
        authorizationMethod: 'cvv',
        billingAddress: shippingAddress
      }),
      redirectUrl: 'https://google.com/success',
      terminalType: 'WEB',
      transactionExpirationTime: '30',
      transactionId: 'my test transactionId',
      transactionType: 'pay',
      userInfo: JSON.stringify({
        ip: '8.8.8.8',
        email: 'test@gmail.com',
        phoneNo: '123456'
      }),
      version: '1.0'
    }
  })

  /*
  {
    amount: '100',
    redirectUrl: 'https://checkout1.uat.useepay.com/v2?accessToken=eAG1VW1v4zYM_iuF9zUvtmPn7dMa93ova3PZJUV3G4aDLMm2WlsyJDmJW_S_j3Tsxr3tsH1ZCwQWSZEPyYfUs6O5qXLrLJ-dnBi7JgV3lo7lxjoDhxLNdnXJjbP8wylAzTWKQMOEoWrPNXySssx5SWr4TJVKu--9MAQNqfPnwBEmIvLXStDHDRguHalAVWZK8rWCo-dPgnAKokTo7zGkxPIDqbeq0hSh3W3fvdtcfsX7pC64tLfcZoohxOc3gJ8dC9DhBkB4GZxPHfKerJdaT9pk8ALo5akoVHMm7LemAmjWr86r-9dq9C6eZT-6dS5c79pbodKM648ygXo1obWAI4P0DofDSEipDmTPLaeZVLlK69yyEVUFlIlWWnNJsex32ysQgF9m2kYX9UVT84vGPSgLaHFGpP3chEP_YIJ0uLCaSEOoFUpC3IFzAoQWnuv5oef5gRdOwvnc9eY-6Bv7ywKoBQZuJ0A6gcSQnENXHF4QkcMZI_yc4qFFTfI8UjIRaZcyYaQE_oGtG4AzBJnyG_ipSIoePRDyIuaMcXadp2iHEsl2ouAR1ASv_nR9HQQNmLSwkebALVQ7S28WTNwwmHkT-IASFfZWMZHUb7V-EAYLYDMk7U39AHm9zdQhUpW0TB1kCyM_o-ISQEBacgdcRwCeN_OvEFmBYE8dhPLgXxgGmFnXgaa54UkFv54XTLGsnfpGpTg6mbWlWY7HGfOHJhtiHUfKmCGVcAQcGREjkou6ktRgacdFaUowGJ_ijykxGTBp_F2gsYjpKoq1XD3E2dPxt_n7-nAvpskq_v3-E9OF_43FMZtwOgkWfkCn3nwyC1lCFoz6lE7Jwh2VMu3Bbfn2j0TtmW2FxTL9G6dh9Ff27zVFcWWtkhtx5EArH5YEMEDIdKPyHHsJayIcwM5jQnOKPe6oY6CPl2W5IvpD2LbxLNrQnmglcmQs9hAt8AgBrrihWpS2odmrTgGY4h4mpXchgg2aqZy1WwV5i36i_b4X5Fqpluyt-j0OLYMgPU-NrHXThWxp0R2bMUa-NvOBce55bE5FbiJbou2bCQku8R-j1nKtrEgEJTjzpzXbRrck_p_59zWYPDxFUbT9kj38Ej3tdP3JiuNm9Ujt9suxfPqv_AOkO2Fh2cDOYYlJDGRmeVHmMPo4YTjt3bnl6JofPih46xi8VfjAbHDBnK3uNLZ_vH_dcVg-VeGe82H5oaWubxQlHUsqw2_brdrS23NeYPd1LDw57Ab5tPWbUTUVpdwg4m7of7AT8CVaq5sqk1HG6SMgSUhuEHTz9EAeHYCPDBKCnjaLtPOKwUZHQWBJynQEcNvn3KpH2F_wAqhyWZBSLBGxWXo8nM8m1B3ShTsfel7iDgmn8ZAvfDadkpm7WMydl78AO8u6AA%3D%3D',
    resultCode: 'received',
    sign: 'ee54d7301a0b832879236d8b32e3483c',
    errorCode: '0000',
    transactionId: 'my test transactionId',
    errorMsg: 'Successful payment',
    token: 'mop:mapi:redis:1e5873c0-c908-11f0-aecb-e92d66a70998',
    transactionType: 'pay',
    reference: '1012511241535880182',
    signType: 'MD5',
    currency: 'USD',
    merchantNo: '500000000011462'
  }
  */
  console.log(res)
})().catch(console.error)
```
