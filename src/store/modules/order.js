import * as orderListService from '@/services/orderInfo'
import * as types from '../mutation-types'

export const state = {
  orderlist: []
}

export const getters = {
  getOrderList: state => state.orderlist
}

export const actions = {
  /**
   * [获取订单列表信息]
   * @param {[type]} options.dispatch [description]
   * @param {[type]} options.commit   [description]
   * @param {[type]} options.openid   [description]
   */
  async setOrderList ({ dispatch, commit, rootGetters }) {
    try {
      const userId = rootGetters.getUserId
      const res = await orderListService.query({
        wxUserId: userId
      })
      if (res.code === 200) {
        let orderlist = res.obj
        commit(types.SET_ORDERLIST, {orderlist})
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
  [types.SET_ORDERLIST] (state, { orderlist }) {
    state.orderlist = orderlist
  }
}
