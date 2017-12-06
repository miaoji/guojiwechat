import axios from 'axios'
import { storage } from './index'
import router from '@/router'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    params,
    url,
    auth,
    token,
    paramkey,
    timeout = 8000
  } = options

  switch (method.toLowerCase()) {
    case 'get':
      return axios({
        url,
        method: 'get',
        params: data,
        timeout,
        headers: auth ? {'token': token} : {}
      })
    case 'delete':
      return axios({
        url,
        method: 'delete',
        data,
        params,
        timeout,
        headers: auth ? {'token': token} : {}
      })
    case 'parampost':
      let param = new URLSearchParams()
      param.append(paramkey, data)
      return axios({
        url,
        method: 'post',
        params,
        data,
        timeout,
        headers: {
          'content-Type': 'application/x-www-form-urlencoded',
          'token': auth ? token : {}
        }
      })
    case 'post':
      return axios({
        url,
        method: 'post',
        data,
        params,
        timeout,
        headers: auth ? {'token': token} : {}
      })
    case 'put':
      return axios.put(url, data)
    case 'patch':
      return axios.patch(url, data)
    default:
      return axios(options)
  }
}

export default function request (options) {
  options.token = storage({key: 'token'})
  return fetch(options).then((response) => {
    const { status } = response
    let data = response.data
    data = typeof data === 'object' ? data : {'stringData': data}
    return {
      success: true,
      statusCode: status,
      ...data
    }
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      if (Number(statusCode) === 401) {
        storage({
          key: ['redirect_uri', 'appid'],
          type: 'removeexcept'
        })
        const fromPath = router.history.current
        const redirectUri = fromPath.fullPath
        const {appid} = fromPath.query
        if (redirectUri !== '/init') {
          storage({
            key: 'redirect_uri',
            val: redirectUri,
            type: 'set'
          })
          storage({
            key: 'appid',
            val: appid || 'typeisappidis00000000',
            type: 'set'
          })
        }
        return router.push({
          path: '/init'
        })
      }
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || '网络错误'
    }
    return { success: false, statusCode, message: msg }
  })
}
