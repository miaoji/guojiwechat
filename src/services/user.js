/**
 * 用户
 */
import request from '../utils/request'
import { user as userApi } from '@/api'

export async function show (data) {
  return request({
    url: userApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  return request({
    url: userApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function update (params) {
  return request({
    url: userApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function getOpenid (params) {
  return request({
    url: userApi.getOpenid,
    method: 'post',
    auth: true,
    params
  })
}

export async function bindPhone (data) {
  return request({
    url: userApi.bindPhone,
    method: 'get',
    auth: true,
    data
  })
}

export async function getDefaultAddr (data) {
  return request({
    url: userApi.defaultAddress,
    method: 'get',
    auth: true,
    data
  })
}
