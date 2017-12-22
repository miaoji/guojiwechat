import { query } from '@/services/cargo'
import { storage } from '@/utils'
import * as types from '../mutation-types'

export const state = {
  list: {
    page: 1,
    rows: 15,
    data: [],
    total: 0
  }
}

export const getters = {
  getCargoList: state => state.list
}

export const actions = {
  /**
   * [获取集运订单列表信息]
   * @param {[type]} options.dispatch [description]
   * @param {[type]} options.commit   [description]
   * @param {[type]} options.openid   [description]
   */
  async setCargoList ({ dispatch, commit }, {page = 1, rows = 10}) {
    try {
      const res = await query({
        wxUserId: storage({key: 'userId'}),
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
