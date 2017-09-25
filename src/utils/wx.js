import * as wxService from '@/services/wx'
import { getConfByEnv } from '@/utils'

/**
 * [初始化wx jssdk]
 * @return {[type]} [description]
 */
export const init = function () {
  return new Promise(async (resolve, reject) => {
    const conf = getConfByEnv()
    const wxconfig = await wxService.getJssdkConfig({
      url: conf.jssdk.initUrl
    })
    if (!wxconfig.success) {
      return reject({
        text: '获取微信jssdk配置失败',
        type: 'warn',
        width: '18rem'
      })
    }
    const jssdk = JSON.parse(wxconfig.obj)
    window.wx.config({
      debug: false,
      appId: conf.appid,
      timestamp: jssdk.timestamp,
      nonceStr: jssdk.nonceStr,
      signature: jssdk.signature,
      jsApiList: [
        'chooseImage',
        'chooseWXPay'
      ]
    })
    return resolve({
      text: '微信jssdk初始化成功',
      type: 'success',
      width: '18rem'
    })
  })
}

export const pay = function ({intParams, successParams}) {
  return new Promise(async (resolve, reject) => {
    const wxpayCon = await wxService.getWxPayConfig({
      ...intParams
    })
    if (!wxpayCon.success) {
      return reject({
        text: '提交失败',
        type: 'warn',
        width: '16rem'
      })
    }
    const prepayId = wxpayCon.package.replace(/prepay_id=/, '')
    successParams['prepayId'] = prepayId
    window.wx.ready(function () {
      console.log('wx jssdk 初始化成功')
      window.wx.chooseWXPay({
        'timestamp': wxpayCon.timeStamp,
        'nonceStr': wxpayCon.nonceStr,
        'package': wxpayCon.package,
        'signType': 'MD5',
        'paySign': wxpayCon.paySign,
        success: async function (res) {
          const successRes = await wxService.updateWxPay({
            ...successParams
          })
          if (successRes.success) {
            resolve({
              text: '支付成功',
              type: 'success',
              width: '16rem'
            })
          } else {
            reject({
              text: '支付成功, 保存记录失败',
              type: 'warn',
              width: '20rem'
            })
          }
        },
        cancel: function () {
          reject({
            text: '支付失败, 已取消',
            type: 'warn',
            width: '20rem'
          })
        },
        fail: function () {
          reject({
            text: '支付失败',
            type: 'warn',
            width: '16rem'
          })
        }
      })
    })
  })
}
