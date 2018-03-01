// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueScroller from 'vue-scroller'
import vuexI18n from 'vuex-i18n'
import { Group, Cell, ConfirmPlugin, Tab, TabItem, ToastPlugin, LoadingPlugin, DatetimePlugin } from 'vux'
import { storage } from '@/utils'
import router from '@/router'
import store from '@/store'
import App from '@/App'
import * as filters from '@/filters'
import translationsZhcn from '@/assets/language/zhcn'
import translationsEn from '@/assets/language/en'
import MJSpinner from '@/components/MJSpinner.vue'

Vue.config.productionTip = false

FastClick.attach(document.body)

Vue.use(VueScroller)

Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(vuexI18n.plugin, store, {
  moduleName: 'i18n',
  onTranslationNotFound (locale, key) {
    switch (key) {
      case '200':
        return 'Everything went fine'
      default:
        return 'There was a problem'
    }
  }
})

Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('tab', Tab)
Vue.component('tabItem', TabItem)
Vue.component('mj-spinner', MJSpinner)

Vue.i18n.add('en', translationsEn)
Vue.i18n.add('zh-cn', translationsZhcn)

Vue.i18n.set('zh-cn')
// Vue.i18n.set('en')

router.beforeEach(async function (to, from, next) {
  // 开发环境跳过验证登录码是否过期
  // if (process.env.NODE_ENV === 'development') {
  //   return next()
  // }
  // login auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const openid = storage({key: 'openid'})
    const unionid = storage({key: 'unionid'})
    const token = storage({key: 'token'})
    const userid = store.state.user.userinfo.id
    // openid、userid、token等参数都存在，则直接进入页面
    if (openid && userid && token && unionid) {
      return next()
    }
    // 如果用户未登录，本地中有openid和unionid，则自动登录
    if (!userid) {
      const userres = await store.dispatch('setUserInfo', {openid, unionid})
      if (userres.type === 'success') {
        return next()
      }
    }
    storage({
      type: 'clear'
    })
    const redirectUri = to.fullPath
    const {appid} = to.query
    storage({
      key: 'redirect_uri',
      val: redirectUri,
      type: 'set'
    })
    storage({
      key: 'appid',
      val: appid || 'typeisappidis00000000',
      type: 'set'
    })
    return next({
      path: '/init'
    })
  }
  return next()
})

router.afterEach((to, from) => {
  if (to.meta.intro) {
    window.document.title = to.meta.intro
  }
  // 决定系统语言
  let locale = storage({
    type: 'get',
    key: 'locale'
  })
  let {language} = store.state.user.userinfo
  language = language.toLowerCase()
  language = language === 'zh_cn' ? 'zh-cn' : 'en'
  if (!locale) {
    locale = language
  }
  Vue.i18n.set(locale)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
window.wxvue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
