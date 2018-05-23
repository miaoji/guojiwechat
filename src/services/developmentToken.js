/**
 * 优惠券
 */
import request from '../utils/request'
import md5 from 'md5'

export async function getToken () {
  const timestamp = new Date().getTime()
  const nonceStr = md5(timestamp + 'winner')
  const key = 'mingz-tech.com'
  const realStr = 'nonceStr=' + nonceStr + '&timestamp=' + timestamp + '&key=' + key
  const sign = md5(realStr)
  const params = {
    nonceStr,
    timestamp,
    sign
  }
  return request({
    url: 'http://api.mingz-tech.com/login/getToken',
    method: 'get',
    data: params,
    auth: false
  })
}
