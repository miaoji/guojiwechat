/**
 * 分销
 */
import request from '../utils/request'
import { promote as promoteApi } from '@/api'

export async function getUserinfo (data) {
  return request({
    url: promoteApi.userinfo,
    method: 'get',
    auth: true,
    data
  })
}

export async function getLevelInfo (data) {
  return request({
    url: promoteApi.levelinfo,
    method: 'get',
    auth: true,
    data
  })
}

export async function getIncome (data) {
  return request({
    url: promoteApi.income,
    method: 'get',
    auth: true,
    data
  })
}

export async function createWithdraw (params) {
  return request({
    url: promoteApi.withdraw,
    method: 'post',
    auth: true,
    params
  })
}
