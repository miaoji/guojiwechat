import request from './request'
import { wx as wxApi } from '@/api'

/**
 * [初始化wx jssdk]
 * @return {[type]} [description]
 */
export const init = async function () {
  const wxconfig = await request({
    method: 'post',
    url: wxApi.jssdk,
    params: {
      url: 'http://guoji.didalive.net/wechat/'
    }
  })
  const jssdk = JSON.parse(wxconfig.obj)
  window.wx.config({
    debug: false,
    appId: 'wxddd3ecf13e8fca82',
    timestamp: jssdk.timestamp,
    nonceStr: jssdk.nonceStr,
    signature: jssdk.signature,
    jsApiList: [
      'chooseImage',
      'chooseWXPay'
    ]
  })
  window.wx.error(function (res) {
    console.log('wx error res', res)
  })
}
