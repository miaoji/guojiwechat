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

export async function getCouponByOpenId (params) {
  return request({
    url: couponApi.getCouponByOpenId,
    method: 'get',
    data: params,
    auth: true
  })
}

export async function createCoupon (params) {
  return request({
    url: couponApi.add,
    method: 'post',
    params,
    auth: true
  })
}
