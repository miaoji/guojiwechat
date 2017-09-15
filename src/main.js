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

function SwitchfullPath (fullPath) {
  let page = ''
  switch (fullPath) {
    case '/send':
      page = 2
      break
    case '/usercenter':
      page = 3
      break
    default:
      page = 3
      break
  }
  return page
}

router.beforeEach(function (to, from, next) {
  // login auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境验证登录码是否过期
      const expire = storage({key: 'expire'}) || JSON.stringify({'expire': '0'})
      if (!expire || JSON.parse(expire)['expire'] <= (new Date().getTime())) {
        storage({
          type: 'remove',
          key: [
            'init',
            'token',
            'nickname',
            'mobile',
            'userId',
            'headimgurl',
            'openid'
          ]
        })
        const fullPath = to.fullPath
        const page = SwitchfullPath(fullPath)
        return next({
          path: '/init',
          query: { page }
        })
      }
    }
    // 时间戳未过期，进行下一步验证
    const openid = storage({key: 'openid'})
    const userid = storage({key: 'userId'})
    const token = storage({key: 'token'})
    if (!openid || userid === '' || !userid || !token) {
      const fullPath = to.fullPath
      const page = SwitchfullPath(fullPath)
      return next({
        path: '/init',
        query: { page }
      })
    }
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
