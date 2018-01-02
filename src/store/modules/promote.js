import * as types from '../mutation-types'

export const state = {
  tipshow: false
}

export const getters = {
  getisTipShow: state => state.tipshow
}

export const actions = {
}

export const mutations = {
  [types.SET_TIPSHOW] (state, { tipshow }) {
    state.tipshow = tipshow
  }
}
