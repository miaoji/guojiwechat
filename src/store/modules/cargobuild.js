import * as TYPES from '../mutation-types'

export const state = {
  cargoBuildList: {}
}

export const getters = {
  getCargoBuildList: state => state.cargoBuildList
}

export const actions = {
}

export const mutations = {
  [TYPES.SET_CAEGO_BUILD_LIST] (state, { cargoBuildList }) {
    state.cargoBuildList = cargoBuildList
  }
}
