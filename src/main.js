// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueScroller from 'vue-scroller'
import { WechatPlugin, Group, Cell, ConfirmPlugin, Tab, TabItem, ToastPlugin, LoadingPlugin } from 'vux'
import { storage } from '@/utils'
import router from './router'
import store from './store'
import App from './App'
import * as filters from './filters'
import OrderItem from './components/OrderItem.vue'
import MJSpinner from './components/MJSpinner.vue'
import GetPositionMsg from './components/GetPositionMsg.vue'
import SelectCountry from './components/SelectCountry.vue'

FastClick.attach(document.body)

Vue.use(VueScroller)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

Vue.config.productionTip = false

Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('tab', Tab)
Vue.component('tabItem', TabItem)
Vue.component('mj-spinner', MJSpinner)
Vue.component('mj-orderitem', OrderItem)
Vue.component('get-position', GetPositionMsg)
Vue.component('select-country', SelectCountry)

router.beforeEach(function (to, from, next) {
  // 开发环境跳过验证登录码是否过期
  if (process.env.NODE_ENV === 'development') {
    return next()
  }
  // login auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const openid = storage({key: 'openid'})
    const userid = storage({key: 'userId'})
    const token = storage({key: 'token'})
    const expire = storage({key: 'expire'}) || JSON.stringify({'expire': '0'})
    const nowDate = new Date().getTime()
    if (JSON.parse(expire)['expire'] >= nowDate && openid && userid && token) {
      return next()
    }
    storage({
      type: 'remove',
      key: [
        'init',
        'token',
        'nickName',
        'mobile',
        'userId',
        'headimgurl',
        'openid'
      ]
    })
    const redirectUri = to.path
    const {appid} = to.query
    storage({
      key: 'redirect_uri',
      val: redirectUri,
      type: 'set'
    })
    storage({
      key: 'appid',
      val: appid,
      type: 'set'
    })
    return next({
      path: '/init'
    })
  }
  return next()
})

router.afterEach((to, from) => {
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
