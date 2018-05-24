import * as TYPES from '../mutation-types'

export const state = {
  couponList: {},
  showCouponBtn: false
}

export const getters = {
  getCouponList: state => state.couponList,
  getshowCouponBtn: state => state.showCouponBtn
}

export const actions = {
}

export const mutations = {
  [TYPES.SET_COUPON_LIST] (state, { couponList }) {
    state.couponList = couponList
    state.showCouponBtn = true
  }
}
