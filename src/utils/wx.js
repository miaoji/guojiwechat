import * as wxService from '@/services/wx'
import { getConfByEnv } from '@/utils'
import { createCoupon } from '@/services/coupon'
import store from '../store'

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
        'chooseWXPay',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'previewImage'
      ]
    })
    return resolve({
      text: '微信jssdk初始化成功',
      type: 'success',
      width: '18rem'
    })
  })
}

/**
 * [pay 微信公众号付款]
 * @param  {[type]} options.initParams    [description]
 * @param  {[type]} options.successParams [description]
 * @return {[type]}                       [description]
 * example
 * let initParams = {
 *    openid: storage({key: 'openid'}),
 *    money: total,
 *    orderNo,
 *    body: '国际快递包裹',
 *    payType: 0
 * }
 * let successParams = {
 *   orderNo,
 *   total,
 *   paymentStatus: 1,
 *   payType: 0
 * }
 */
export const pay = function ({initParams, successParams}) {
  return new Promise(async (resolve, reject) => {
    const wxpayCon = await wxService.getWxPayConfig({
      ...initParams
    })
    if (!wxpayCon.success) {
      return reject({
        text: '提交失败',
        type: 'warn',
        width: '16rem'
      })
    }
    window.wx.ready(function () {
      window.wx.chooseWXPay({
        'timestamp': wxpayCon.timeStamp,
        'nonceStr': wxpayCon.nonceStr,
        'package': wxpayCon.package,
        'signType': 'MD5',
        'paySign': wxpayCon.paySign,
        success: async function (res) {
          await createCoupon({type: 1, wxUserId: store.getters.getUserId})
          resolve({
            text: '支付成功',
            type: 'success',
            width: '16rem'
          })
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
