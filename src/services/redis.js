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

export async function save (data) {
  return request({
    url: redisApi.save,
    method: 'post',
    auth: true,
    data
  })
}
