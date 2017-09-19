import request from '../utils/request'
import { country as countryApi, province as provinceApi, city as cityApi, county as countyApi } from '@/api'

export async function queryCountry (data) {
  return request({
    url: countryApi.query,
    method: 'get',
    auth: true,
    data
  })
}

export async function showCountry (data) {
  return request({
    url: countryApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function showProvince (data) {
  return request({
    url: provinceApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function showCity (data) {
  return request({
    url: cityApi.show,
    method: 'get',
    auth: true,
    data
  })
}

export async function showCounty (data) {
  return request({
    url: countyApi.show,
    method: 'get',
    auth: true,
    data
  })
}
