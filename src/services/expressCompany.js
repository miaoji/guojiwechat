/**
 * 快递公司
 */
import request from '../utils/request'
import { expressCompany as expressCompanyApi } from '@/api'

export async function query (data) {
  return request({
    url: expressCompanyApi.query,
    method: 'get',
    auth: true,
    data
  })
}
