/**
 * 补价
 */
import request from '../utils/request'
import { boot as bootApi } from '../api'

export async function query (params) {
  return request({
    url: bootApi.query,
    method: 'get',
    data: params,
    auth: true
  })
}
