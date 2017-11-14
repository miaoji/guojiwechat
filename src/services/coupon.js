/**
 * 优惠券
 */
import request from '../utils/request'
import { coupon as couponApi } from '../api'

export async function query (params) {
  return request({
    url: couponApi.query,
    method: 'get',
    data: params,
    auth: true
  })
}