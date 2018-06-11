import { query, remove, show, cancelMergeCargo, selectOrderByCargoType, mergeCargo } from '@/services/cargo'
import { getDefaultAddr } from '@/services/user'
import { query as queryTransfer } from '@/services/transferAddr'
import router from '@/router'

import * as types from '../mutation-types'

export const state = {
  list: {
    page: 1,
    rows: 15,
    data: [],
    total: 0
  },
  receiveAddressesId: 0,
  cargoBuildList: [],
  noWmsData: [],
  wmsData: [],
  index: 0,
  packageList: [],
  defaultTransfer: {
    provinces: {},
    districts: {}
  }
}

export const getters = {
  getCargoList: state => state.list,
  getReceiveAddressesId: state => state.receiveAddressesId,
  getCargoBuildList: state => state.cargoBuildList,
  noWmsData: state => state.noWmsData,
  wmsData: state => state.wmsData,
  packageList: state => state.packageList,
  defaultTransfer: state => state.defaultTransfer
}

export const actions = {
  // 获取默认中转站地址
  async getDefaultTransfer({ commit }) {
    const data = await queryTransfer({ isDefault: 1 })
    console.log('data', data)
    if (data.code === 200) {
      commit(types.SET_CARGO_STATE, { defaultTransfer: data.obj[0] || [] })
    }
  },
  // 取消合单
  async cancelBuild({ dispatch }, { id, parentId }) {
    const data = await cancelMergeCargo({ data: [id] })
    if (data.code === 200) {
      dispatch('getPackageList', { parentId })
    }
  },
  // 根据parentId查询子订单
  async getPackageList({ state }, { parentId }) {
    const data = await show({ parentId })
    console.log('data', data)
    if (data.code === 200) {
      if (!data.obj) {
        const res = await remove({ ids: parentId })
        if (res.code === 200) {
          router.push({ path: '/cargo' })
        }
      }
      state.packageList = data.obj || []
    }
  },
  // 合并订单
  async orderBuild({ getters, dispatch, state }, { selectList }) {
    const data = await mergeCargo(
      {
        data: selectList,
        params: {
          type: 1,
          cargoType: -1,
          // 货物类型, -1普货, -2特货
          wxUserId: getters.getUserId
        }
      }
    )
    if (data.code === 200) {
      dispatch('getCargoListByUserId')
      console.log('state.index', state.index)
      dispatch('selectOrderByCargoType', { cargoStatus: state.index })
      // this.$vux.toast.show({
      //   type: 'success',
      //   text: '合单成功'
      // })
    }
  },
  // 查询未到库订单和已到库订单
  async selectOrderByCargoType({ state, getters }, { cargoStatus }) {
    state.index = cargoStatus
    const data = await selectOrderByCargoType({
      cargoStatus,
      wxUserId: getters.getUserId
    })
    if (data.code === 200) {
      if (cargoStatus === 0) {
        state.noWmsData = data.obj || []
      }
      if (cargoStatus === 1) {
        state.wmsData = data.obj || []
      }
    }
  },
  // 根据微信userId 查询用户已合订单
  async getCargoListByUserId({ getters, commit }) {
    const data = await show({
      parentId: -10,
      wxUserId: getters.getUserId
    })
    if (data.code === 200) {
      commit(types.SET_CARGO_STATE, { cargoBuildList: data.obj || [] })
    }
  },
  async getDefaultAddr({ getters, state }) {
    const data = await getDefaultAddr({ WxUserId: getters.getUserId })
    if (data.code === 200) {
      state.receiveAddressesId = data.obj.receiveAddresses[0].id
    }
  },
  /**
   * [获取集运订单列表信息]
   * @param {[type]} options.dispatch [description]
   * @param {[type]} options.commit   [description]
   * @param {[type]} options.openid   [description]
   */
  async setCargoList({ dispatch, commit, rootGetters }, { page = 1, rows = 10 }) {
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
        commit(types.SET_CARGOLIST, { list })
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
  [types.SET_CARGOLIST](state, { list }) {
    state.list = list
  },
  [types.SET_CARGO_STATE](state, payload) {
    for (let key in payload) {
      state[key] = payload[key]
    }
  }
}
