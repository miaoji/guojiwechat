/**
 * 包裹类型
 */
import request from '../utils/request'
import { packageType as packageTypeApi } from '@/api'

export async function query (data) {
  return request({
    url: packageTypeApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function queryCascade (data) {
  return request({
    url: packageTypeApi.queryCascade,
    method: 'get',
    auth: true,
    data
  })
}

export async function show (data) {
  return request({
    url: packageTypeApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function showByCountry (data) {
  return request({
    url: packageTypeApi.showByCountry,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  return request({
    url: packageTypeApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function update (params) {
  return request({
    url: packageTypeApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: packageTypeApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}
