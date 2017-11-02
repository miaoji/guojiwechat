import request from '../utils/request'
import { redis as redisApi } from '@/api'

export async function query (data) {
  return request({
    url: redisApi.query,
    method: 'get',
    auth: true,
    data
  })
}
