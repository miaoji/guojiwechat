const NODE_ENV = process.env.NODE_ENV
let url

switch (NODE_ENV) {
  case 'development':
    // 仝舟
    // url = 'http://192.168.1.210:8080/'
    // 测试 app 云端服务 Wechat
    url = 'http://api.didalive.net/'
    // 正式 app 云端服务 Wechat
    // url = 'http://api.mingz-tech.com/'
    break
  case 'production':
    url = 'http://api.mingz-tech.com/'
    break
  case 'test':
    url = 'http://api.didalive.net/'
    break
  default:
    break
}

// 寄件地址
export const mailingAddr = {
  query: url + 'api/mailingAddr/index',
  save: url + 'api/mailingAddr/add',
  show: url + 'api/mailingAddr/getMailingAddressById',
  update: url + 'api/mailingAddr/modMailingAddressById',
  delete: url + 'api/mailingAddr/delMailingAddressById'
}

// 收件地址
export const receiveAddr = {
  query: url + 'api/receiveAddr/index',
  save: url + 'api/receiveAddr/add',
  show: url + 'api/receiveAddr/getReceiveAddressById',
  update: url + 'api/receiveAddr/modReceiveAddressById',
  delete: url + 'api/receiveAddr/delReceiveAddressById'
}

// 国家
export const country = {
  query: url + 'api/country/index',
  save: url + 'api/country/add',
  show: url + 'api/country/getCountryById',
  update: url + 'api/country/modCountryById',
  delete: url + 'api/country/delCountryById'
}

// 省份
export const province = {
  query: url + 'api/provinces/index',
  save: url + 'api/provinces/add',
  show: url + 'api/provinces/getProvincesById',
  update: url + 'api/provinces/modProvincesById',
  delete: url + 'api/provinces/delProvincesById'
}

// 市、区
export const city = {
  query: url + 'api/cities/index',
  save: url + 'api/cities/add',
  show: url + 'api/cities/getProvincesById',
  update: url + 'api/cities/modCitiesById',
  delete: url + 'api/cities/delCitiesById'
}

// 县级
export const county = {
  query: url + 'api/districts/index',
  save: url + 'api/districts/add',
  show: url + 'api/districts/getDistrictsById',
  update: url + 'api/districts/modDistrictsById',
  delete: url + 'api/districts/delDistrictsById'
}

// 微信配置参数，微信支付参数
export const wx = {
  webtokenFunc: function (AppId, secret, code) {
    const url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppId + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code'
    return url
  },
  webtoken: 'https://api.weixin.qq.com/sns/oauth2/access_token',
  jssdk: url + 'getWxConfig/',
  wxpayInit: url + 'api/pay/pay',
  wxpayUpdate: url + 'api/pay/dealPay'
}

// 包裹类型
export const packageType = {
  query: url + 'api/packageType/index',
  save: url + 'api/packageType/add',
  show: url + 'api/packageType/getPackageTypeById',
  showByCountry: url + 'api/packageType/getPackageTypeByCountry',
  update: url + 'api/packageType/modPackageTypeById',
  delete: url + 'api/packageType/delPackageTypeById'
}

// 产品类型
export const productType = {
  query: url + 'api/productType/index',
  save: url + 'api/productType/add',
  show: url + 'api/productType/getProductTypeById',
  showByPackage: url + 'api/productType/getProductByPackage',
  update: url + 'api/productType/modProductTypeById',
  delete: url + 'api/productType/delProductTypeById'
}

// 价格查询
export const price = {
  showAdvanced: url + 'api/intlPrice/getIntlPrice',
  order: url + 'wx/Price/ShowPrice',
  pricelist: url + 'wx/Internationalprice/ShowInternationalprice'
}

// 订单 创建，查询
export const orderInfo = {
  query: url + 'api/orderInfo/index',
  save: url + 'api/orderInfo/add',
  show: url + 'api/orderInfo/getOrderInfoById',
  update: url + 'api/orderInfo/modOrderInfoById',
  delete: url + 'api/orderInfo/delOrderInfoById'
}

// 用户信息等
export const user = {
  gettoken: function (code, params) {
    return url + 'wx/GetAccessToken?code=' + code + '&params=' + params
  },
  bindPhone: url + 'wx/User/AddUserPhone',
  show: url + 'login/wxLogin',
  getOpenid: url + 'login/getOpenid'
}

// 短信发送接口
export const sms = {
  send: url + 'login/sendCode'
}

// 物流信息
export const expressRoute = {
  zto: url + 'wx/order/getOrderInfo',
  kd100: url + 'api/order/queryByCompany'
}

// 查询补价
export const boot = {
  query: url + 'api/closingPrice/index',
  show: url + 'api/closingPrice/getClosingPriceById',
  // 单个
  getLast: url + 'api/closingPrice/getLast',
  getByOrderNo: url + 'api/closingPrice/getByOrderNo'
}
