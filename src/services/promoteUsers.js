import request from '../utils/request'
import { promoteUsers } from '@/api'

export async function query (params) {
  return request({
    url: promoteUsers.query,
    method: 'get',
    auth: true,
    data: params
  })
}
