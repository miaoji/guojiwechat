/**
 * 寄件地址
 */
import request from '../utils/request'
import { transferAddr as transferAddrApi } from '@/api'

export async function query (data) {
  return request({
    url: transferAddrApi.query,
    method: 'get',
    auth: true,
    data
  })
}
