import Vue from 'vue'
import Vuex from 'vuex'
import * as address from './modules/address'
import * as cargo from './modules/cargo'
import * as order from './modules/order'
import * as promote from './modules/promote'
import * as user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    address,
    cargo,
    order,
    promote,
    user
  },
  state: {
    title: '国际快递服务中心',
    isLoading: false,
    isJump: false,
    jumpSrc: 'http://112.74.34.241:3000/pics/random?show=1',
    toast: {
      show: false,
      type: 'success',
      info: 'show'
    },
    page: 'usercenter',
    issubscribe: true
  },
  actions: {
  },
  getters: {
    getPage: state => state.page
  },
  mutations: {
    SET_TITLE (state, { title }) {
      state.title = title
    },
    SET_PAGE (state, { page }) {
      state.page = page
    },
    SET_BRAND (state, { brand }) {
      state.brand = brand
    },
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateJumpStatus (state, payload) {
      state.isJump = payload.isJump
    },
    updateJumpSrc (state, payload) {
      state.jumpSrc = payload.jumpSrc
    }
  }
})

export default store
