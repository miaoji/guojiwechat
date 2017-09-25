/**
 * 短信
 */
import request from '../utils/request'
import { sms as smsApi } from '@/api'

export async function send (data) {
  return request({
    url: smsApi.send,
    method: 'get',
    auth: true,
    data
  })
}
