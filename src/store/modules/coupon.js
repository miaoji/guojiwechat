import * as TYPES from '../mutation-types'

export const state = {
  couponList: {},
  couponTotalFee: 0
}

export const getters = {
  getCouponList: state => state.couponList,
  getCouponTotalFee: state => state.couponTotalFee
}

export const actions = {
}

export const mutations = {
  [TYPES.SET_COUPON_LIST] (state, { couponList }) {
    state.couponList = couponList
  },
  [TYPES.SET_COUPON_TOTAL_FEE] (state, { totalFee }) {
    state.couponTotalFee = totalFee
  }
}
