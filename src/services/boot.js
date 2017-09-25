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

export async function show (params) {
  return request({
    url: bootApi.show,
    method: 'get',
    data: params,
    auth: true
  })
}

export async function getLast (params) {
  return request({
    url: bootApi.getLast,
    method: 'get',
    data: params,
    auth: true
  })
}

export async function getByOrderNo (params) {
  return request({
    url: bootApi.getByOrderNo,
    method: 'get',
    data: params,
    auth: true
  })
}

