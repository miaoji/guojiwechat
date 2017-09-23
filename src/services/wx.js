/**
 * 微信配置，微信pay
 */
import request from '../utils/request'
import { wx as wxApi } from '@/api'

/**
 * [获取微信jssdk配置]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export async function getJssdkConfig (data) {
  return request({
    url: wxApi.jssdk,
    method: 'get',
    auth: true,
    data
  })
}

/**
 * [获取微信pay参数]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export async function getWxPayConfig (params) {
  return request({
    url: wxApi.wxpayInit,
    method: 'post',
    auth: true,
    params
  })
}

/**
 * [用户使用微信pay后提交记录]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export async function updateWxPay (params) {
  return request({
    url: wxApi.wxpayUpdate,
    method: 'post',
    auth: true,
    params
  })
}
