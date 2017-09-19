import request from '../utils/request'
import { receiveAddr as receiveAddrApi } from '@/api'

export async function query (data) {
  return request({
    url: receiveAddrApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  return request({
    url: receiveAddrApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: receiveAddrApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}
