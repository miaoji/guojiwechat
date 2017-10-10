/**
 * 物流信息
 */
import request from '../utils/request'
import { expressRoute as expressRouteApi } from '@/api'

export async function getZTO (data) {
  return request({
    url: expressRouteApi.zto,
    method: 'get',
    auth: true,
    data
  })
}

export async function getKD100 (data) {
  return request({
    url: expressRouteApi.kd100,
    method: 'get',
    auth: true,
    data
  })
}
