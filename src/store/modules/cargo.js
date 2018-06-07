import { query } from '@/services/cargo'
import { getDefaultAddr } from '@/services/user'

import * as types from '../mutation-types'

export const state = {
  list: {
    page: 1,
    rows: 15,
    data: [],
    total: 0
  },
  receiveAddressesId: 0
}

export const getters = {
  getCargoList: state => state.list,
  getReceiveAddressesId: state => state.receiveAddressesId
}

export const actions = {
  async getDefaultAddr ({getters, state}) {
    const data = await getDefaultAddr({WxUserId: getters.getUserId})
    if (data.code === 200) {
      console.log('data', data)
      state.receiveAddressesId = data.obj.receiveAddresses[0].id
    }
  },
  /**
   * [获取集运订单列表信息]
   * @param {[type]} options.dispatch [description]
   * @param {[type]} options.commit   [description]
   * @param {[type]} options.openid   [description]
   */
  async setCargoList ({ dispatch, commit, rootGetters }, {page = 1, rows = 10}) {
    try {
      const userId = rootGetters.getUserId
      const res = await query({
        wxUserId: userId,
        page,
        rows,
        status: []
      })
      if (res.code === 200) {
        const data = res.obj
        let list = {
          page,
          rows,
          data,
          total: res.total
        }
        commit(types.SET_CARGOLIST, {list})
        return {
          text: '获取订单列表成功',
          width: '18rem',
          type: 'success'
        }
      }
      return {
        text: res.mess || '获取订单列表失败',
        width: '18rem',
        type: 'warn'
      }
    } catch (err) {
      console.error(err)
      return {
        text: '网络错误',
        width: '15rem',
        type: 'warn'
      }
    }
  }
}

export const mutations = {
  [types.SET_CARGOLIST] (state, { list }) {
    state.list = list
  }
}
