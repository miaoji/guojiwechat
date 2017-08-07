import {address as addressApi} from '@/api'
import axios from 'axios'
import window from 'window'

import * as types from '../mutation-types'

let local = window.localStorage
let instance = axios.create({
  timeout: 3000
})

export const state = {
  data: {},
  query: {
  }
}

// getters
export const getters = {
  getAddress: state => state.data,
  getAddressResult: state => state.result
}

// actions
export const actions = {
  async changeAddress ({ commit }) {
    try {
      const send = await instance({
        method: 'post',
        url: addressApi.send,
        params: {
          userid: local.getItem('mj_userId')
        }
      })
      const pickup = await instance({
        method: 'post',
        url: addressApi.pickup,
        params: {
          userid: local.getItem('mj_userId')
        }
      })
      if (send.status === 200 && pickup.status === 200) {
        console.log('send', send.data)
        console.log('pickup', pickup.data)
        let data = {
          send: send.data.obj,
          pickup: pickup.data.obj
        }
        commit(types.SET_ADDRESS, {data})
        return {
          type: 'success',
          info: '请求成功',
          width: '18rem'
        }
      }
      return {
        type: 'warn',
        info: '获取地址信息失败',
        width: '18rem'
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        info: '网络错误',
        width: '18rem'
      }
    }
  },
  async addAddress ({commit, dispatch}, {address, province, city, district, mobile, name, checked = 2, userId = local.getItem('mj_userId'), addressType = 1}) {
    try {
      const res = await instance({
        method: 'post',
        url: addressApi.add,
        params: {
          address, province, city, district, mobile, name, checked, userId, addressType
        }
      })
      if (res.status === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          info: '添加地址成功',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      let result = {
        type: 'warn',
        info: '添加地址失败',
        width: '18rem'
      }
      commit(types.SET_ADDRESS_RES, {result})
    }
  },
  eidtAddress ({dispatch}, {id, address, province, city, district, mobile, name, checked = 2, userId = local.getItem('mj_userId'), addressType = 1}) {
    instance.get(addressApi.update, {
      params: {id, address, province, city, district, mobile, name, checked, userId, addressType}
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch('changeAddress')
      }
    })
    .catch(err => {
      console.error(err)
    })
  },
  checkedAddress ({commit, dispatch}, {id, addressType}) {
    instance.get(addressApi.checked, {
      params: {id, addressType, userId: local.getItem('mj_userId')}
    })
    .then((res) => {
      console.log('res url', res.request.responseURL)
      if (res.status === 200) {
        dispatch('changeAddress')
        let result = {
          show: true,
          type: 'success',
          info: '修改默认地址成功'
        }
        commit(types.SET_ADDRESS_RES, {result})
      } else {
        let result = {
          show: true,
          type: 'warn',
          info: '修改默认地址失败'
        }
        commit(types.SET_ADDRESS_RES, {result})
      }
    })
    .catch(err => {
      console.error(err)
      let result = {
        show: true,
        type: 'warn',
        info: '修改默认地址失败',
        width: '16rem'
      }
      commit(types.SET_ADDRESS_RES, {result})
    })
  }
}

export const mutations = {
  [types.SET_ADDRESS] (state, {data}) {
    state.data = data
  },
  [types.SET_ADDRESS_RES] (stater, {result}) {
    state.result = result
  }
}
