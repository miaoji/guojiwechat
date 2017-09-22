/**
 * 产品类型
 */
import request from '../utils/request'
import { productType as productTypeApi } from '@/api'

export async function query (data) {
  return request({
    url: productTypeApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function show (data) {
  return request({
    url: productTypeApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function showByPackage (data) {
  return request({
    url: productTypeApi.showByPackage,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  return request({
    url: productTypeApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function update (params) {
  return request({
    url: productTypeApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: productTypeApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}
