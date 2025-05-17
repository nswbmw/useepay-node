## useepay

UseePay Nodejs SDK

### Install

```sh
$ npm i useepay --save
```

### Usage

```js
const UseePay = require('useepay')
const useepayClient = new UseePay({
  environment: 'sandbox', // sandbox|production
  signType: 'MD5',
  signKey: 'xxx'
})

;(async () => {
  const createCashierRes = await useepayClient.execute({
    method: 'post',
    url: '/cashier',
    form: {
      amount: 100,
      appId: 'xxx',
      autoRedirect: 'false',
      currency: 'USD',
      merchantNo: 'xxx',
      orderInfo: '{"subject":"order title","goodsInfo":[{"id":"商品编号","name":"商品名称","body":"商品描述","category":"商品类目","categoryTree":"商品类目树，不同级别类目使用”|”分割","brand":"商品品牌","quantity":1,"price":1234}],"shippingAddress":{"email":"hai1ley@useepay.com","phoneNo":"1235854433","firstName":"amber","lastName":"Yang","postalCode":"90225","city":"Huntington Park","state":"CA","country":"MX","street":"street"}}',
      payerInfo: '{"paymentMethod":"credit_card","authorizationMethod":"cvv","threeDS2RequestData":{"deviceChannel":"browser","acceptHeader":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","colorDepth":24,"javaEnabled":"false","javaScriptEnabled":"true","language":"zh-HK","screenHeight":1080,"screenWidth":1920,"timeZoneOffset":-480,"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"},"billingAddress":{"email":"hai1ley@useepay.com","phoneNo":"1235854433","firstName":"amber","lastName":"Yang","postalCode":"90225","city":"Huntington Park","state":"CA","country":"MX","street":"street"}}',
      redirectUrl: 'https://google.com/redirectUrl',
      signType: 'MD5',
      terminalType: 'WEB',
      transactionExpirationTime: '60',
      transactionId: String(Date.now()),
      transactionType: 'pay',
      userInfo: '{"userId":"victor1","ip":"104.36.20.51","email":"hai1ley@useepay.com"}',
      version: '1.0'
    }
  })
  console.log(createCashierRes)
})().catch(console.error)
```
