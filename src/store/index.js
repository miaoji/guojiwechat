import Vue from 'vue'
import Vuex from 'vuex'
import * as user from './modules/user'
import * as send from './modules/send'
import * as pickup from './modules/pickup'
import * as address from './modules/address'
import * as userpackage from './modules/package'
import * as express from './modules/express'
import * as boot from './modules/boot'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    send,
    pickup,
    address,
    userpackage,
    express,
    boot
  },
  state: {
    title: '妙寄',
    isLoading: false,
    isJump: false,
    jumpSrc: 'http://112.74.34.241:3000/pics/random?show=1',
    toast: {
      show: false,
      type: 'success',
      info: 'show'
    },
    page: 'usercenter'
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
