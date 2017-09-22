/**
 * 产品类型
 */
import request from '../utils/request'
import { price as priceApi } from '@/api'

export async function showAdvanced (data) {
  return request({
    url: priceApi.showAdvanced,
    method: 'get',
    auth: true,
    data
  })
}
