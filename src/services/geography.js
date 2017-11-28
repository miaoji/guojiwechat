/**
 * 国家，省，市，县区
 */
import request from '../utils/request'
import { country as countryApi, province as provinceApi, city as cityApi, county as countyApi } from '@/api'

export async function queryCascade (data) {
  return request({
    url: countryApi.cascade,
    method: 'get',
    auth: true,
    data
  })
}

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

export async function queryProvince (data) {
  return request({
    url: provinceApi.query,
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

export async function queryCity (data) {
  return request({
    url: cityApi.query,
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

export async function queryCounty (data) {
  return request({
    url: countyApi.query,
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

// key: countyCode
export async function selectProvCityCounty (data) {
  return request({
    url: countyApi.selectProvCityCounty,
    method: 'get',
    auth: true,
    data
  })
}
