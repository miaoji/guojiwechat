/**
 * 订单创建、查询
 */
import request from '../utils/request'
import { cargo as cargoApi } from '@/api'

export async function query (data) {
  return request({
    url: cargoApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function show (data) {
  return request({
    url: cargoApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (data, params) {
  return request({
    url: cargoApi.save,
    method: 'post',
    auth: true,
    data,
    params
  })
}

export async function test (data, params) {
  return request({
    url: cargoApi.test,
    method: 'post',
    auth: true,
    data,
    params
  })
}

export async function update (params) {
  return request({
    url: cargoApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: cargoApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}

export async function queryCargoByBatch (params) {
  console.log('params', params)
  return request({
    url: cargoApi.queryCargoByBatch,
    method: 'get',
    auth: true,
    data: { ...params, page: 1, rows: 10000 }
  })
}

export async function getOrderByParentId (params) {
  return request({
    url: cargoApi.getOrderByParentId,
    method: 'get',
    auth: true,
    data: params
  })
}

export async function cancelMergeCargo (params) {
  return request({
    url: cargoApi.cancelMergeCargo,
    method: 'post',
    auth: true,
    data: params
  })
}

export async function mergeCargo ({ data, params }) {
  return request({
    url: cargoApi.mergeCargo,
    method: 'post',
    auth: true,
    data,
    params
  })
}
