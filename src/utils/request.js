import axios from 'axios'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    params,
    url,
    auth,
    token
  } = options

  switch (method.toLowerCase()) {
    case 'get':
      return axios({
        url,
        method: 'get',
        params: data,
        timeout: 5000,
        headers: auth ? {'token': token} : {}
      })
    case 'delete':
      return axios({
        url,
        method: 'delete',
        data,
        params,
        timeout: 5000,
        headers: auth ? {'token': token} : {}
      })
    case 'post':
      return axios({
        url,
        method: 'post',
        data,
        params,
        timeout: 5000,
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
  options.token = window.localStorage.getItem('mj_token')
  return fetch(options).then((response) => {
    const { status } = response
    let data = response.data
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
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || '网络错误'
    }
    return { success: false, statusCode, message: msg }
  })
}
