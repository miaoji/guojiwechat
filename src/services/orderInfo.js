/**
 * 订单创建、查询
 */
import request from '../utils/request'
import { orderInfo as orderInfoApi } from '@/api'

export async function query (data) {
  return request({
    url: orderInfoApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function show (data) {
  return request({
    url: orderInfoApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  console.log('params', params)
  return request({
    url: orderInfoApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function update (params) {
  return request({
    url: orderInfoApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: orderInfoApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}
