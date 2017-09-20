import request from '../utils/request'
import { mailingAddr as mailingAddrApi } from '@/api'

export async function query (data) {
  return request({
    url: mailingAddrApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function show (data) {
  return request({
    url: mailingAddrApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function save (params) {
  return request({
    url: mailingAddrApi.save,
    method: 'post',
    auth: true,
    params
  })
}

export async function update (params) {
  return request({
    url: mailingAddrApi.update,
    method: 'post',
    auth: true,
    params
  })
}

export async function remove (params) {
  return request({
    url: mailingAddrApi.delete,
    method: 'delete',
    auth: true,
    params
  })
}
