const NODE_ENV = process.env.NODE_ENV
let url

switch (NODE_ENV) {
  case 'development':
    // 仝舟
    url = 'http://192.168.1.111:8080/'
    // 测试 app 云端服务 Wechat
    // url = 'http://api.didalive.net/'
    // 正式 app 云端服务 Wechat
    // url = 'http://api.mingz-tech.com/DHL/'
    break
  case 'production':
    url = 'http://api.mingz-tech.com/DHL/'
    break
  case 'test':
    url = 'http://api.didalive.net/DHL/'
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
  show: url + 'api/districts/getProvincesById',
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

export const geography = {
  queryCountry: url + 'api/country/index',
  showCountry: url + 'wx/Country/ShowCountryid',
  showProvince: url + 'wx/Province/ShowProvinceid',
  showCity: url + 'wx/City/ShowCityid',
  showCounty: url + 'wx/County/ShowCountyid'
}

export const pic = {
  qr: url + 'wx/pic',
  pickupqr: url + 'wx/signpic'
}

export const address = {
  index: url + 'wx/Mailingaddress/ShowMailingaddressuserid',
  send: url + 'wx/Mailingaddress/ShowMailingaddressuserid',
  pickup: url + 'wx/Consigneeaddress/ShowConsigneeaddressuserid',
  addsend: url + 'wx/Mailingaddress/InsertMailingaddress',
  addpickup: url + 'wx/Consigneeaddress/InsertConsigneeaddress',
  updatesend: url + 'wx/Mailingaddress/UpdateMailingaddress',
  updatepickup: url + 'wx/Consigneeaddress/UpdateConsigneeaddress',
  delete: url + 'wx/deleteAddress',
  sendchecked: url + 'wx/Mailingaddress/updateMailingaddressstart',
  pickupchecked: url + 'wx/Consigneeaddress/updateConsigneeaddressdefault',
  default: url + 'wx/GETADDRESSDEFAULT',
  officelocation: url + 'wx/FindStationInfo',
  senddetail: url + 'wx/Mailingaddress/ShowMailingaddressid',
  pickupdetail: url + 'wx/Consigneeaddress/ShowConsigneeaddressid'
}

export const send = {
  index: url + 'wx/findSend',
  create: url + 'wx/OrderInfo/InsertOrderInfo',
  cancle: url + 'wx/end_send'
}

export const site = {
  location: url + 'wx/COORDINATES'
}

export const pickup = {
  sign: url + 'wx/TAKECOURIERSIGN',
  wait: url + 'wx/TAKECOURIER',
  all: url + 'wx/ALLDELIVERY'
}

export const user = {
  gettoken: function (code, params) {
    return url + 'wx/GetAccessToken?code=' + code + '&params=' + params
  },
  sendsms: url + 'wx/User/ShowranCode',
  bindphone: url + 'wx/User/AddUserPhone',
  getuserinfo: url + 'login/wxLogin',
  getwebopenid: 'http://app.quandikeji.com/WeChatService/UserOpenId'
}

export const express = {
  route: 'http://app.quandikeji.com:8088/quandiExpressSite1.4.0/Logistics/queryLogisticsInfoForJson'
}

// 杂项
export const sundry = {
  cargotype: url + 'wx/InternationalProductType/ShowInternationalProductType',
  goods: url + 'wx/Cargotype/ShowCargotype'
}

// 价格查询
export const price = {
  order: url + 'wx/Price/ShowPrice',
  pricelist: url + 'wx/Internationalprice/ShowInternationalprice'
}

export const order = {
  list: url + 'wx/OrderInfo/ShowOrderInfo',
  update: url + 'wx/OrderInfo/UpdateOrderInfostarte',
  updatenumber: url + 'wx/OrderInfo/Updateserialnumberstarte',
  detail: url + 'wx/OrderInfo/ShowOrderInfoid',
  detailbyserialnumber: url + 'wx/OrderInfo/getOrderBySerialnumber',
  ztoinfo: url + 'wx/order/getOrderInfo',
  kd100: url + '/wx/order/queryByCompany'
}

// 查询补价
export const boot = {
  detail: url + 'wx/boot/getBootInfoById',
  // 根据单号查询最新补价信息String serialnumber
  query: url + 'wx/boot/getBootInfo'
}
