import Vue from 'vue'
import Router from 'vue-router'

import Container from '@/views/Container'
import FeedContainer from '@/views/feed/Container'

Vue.use(Router)

export default new Router({
  base: __dirname,
  routes: [{
    path: '/',
    name: 'Container',
    component: Container,
    children: [{
      path: '/usercenter',
      name: 'UserCenter',
      component: require('@/views/user/UserCenter'),
      meta: {
        intro: '个人中心',
        requiresAuth: true
      }
    }, {
      path: '/send',
      name: 'Send',
      component: require('@/views/send/Send'),
      meta: {
        intro: '寄件',
        requiresAuth: true
      }
    }, {
      path: '/consolidation',
      name: 'Consolidation',
      component: require('@/views/consolidation/Index'),
      meta: {
        intro: '集运',
        requiresAuth: false
      }
    }]
  }, {
    path: '/address',
    name: 'Address',
    component: require('@/views/address/Address'),
    meta: {
      intro: '地址簿',
      requiresAuth: true
    }
  }, {
    path: '/assess',
    name: 'Assess',
    component: require('@/views/assess/Assess'),
    meta: {
      intro: '估价系统',
      requiresAuth: true
    }
  }, {
    path: '/address/handle',
    name: 'HandleAddress',
    component: require('@/views/address/HandleAddress'),
    meta: {
      intro: '添加/编辑地址',
      requiresAuth: true
    }
  }, {
    path: '/bindphone',
    name: 'BindPhone',
    component: require('@/views/user/BindPhone'),
    meta: {
      intro: '绑定手机',
      requiresAuth: false
    }
  }, {
    path: '/redirect',
    name: 'Redirect',
    component: require('@/views/user/Redirect')
  }, {
    path: '/init',
    name: 'Init',
    component: require('@/views/user/Init')
  }, {
    path: '/nouser',
    name: 'NoUser',
    component: require('@/views/error/NoUser'),
    meta: {
      intro: '没有该用户',
      requiresAuth: false
    }
  }, {
    path: '/order/list',
    name: 'OrderList',
    component: require('@/views/order/OrderList'),
    meta: {
      intro: '订单列表',
      requiresAuth: true
    }
  }, {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: require('@/views/order/OrderDetail'),
    meta: {
      intro: '订单明细',
      requiresAuth: true
    }
  }, {
    path: '/bootdeal',
    name: 'BootDeal',
    component: require('@/views/boot/BootDeal'),
    meta: {
      intro: '补价处理',
      requiresAuth: false
    }
  }, {
    path: '/bootlist',
    name: 'BootList',
    component: require('@/views/boot/BootList'),
    meta: {
      intro: '补价记录',
      requiresAuth: true
    }
  }, {
    path: '/payresult',
    name: 'PayResult',
    component: require('@/views/pay/Result'),
    meta: {
      intro: '支付结果',
      requiresAuth: true
    }
  }, {
    path: '/feed',
    name: 'FeedContainer',
    component: FeedContainer,
    children: [{
      path: '/feed/recommend',
      name: 'Recommend',
      component: require('@/views/feed/Recommend'),
      meta: {
        requiresAuth: true
      }
    }]
  }, {
    path: '/coupon',
    name: 'CouponList',
    component: require('@/views/coupon/List'),
    meta: {
      intro: '卡券列表',
      requiresAuth: true
    }
  }, {
    path: '/coupon/detail',
    name: 'CouponDetail',
    component: require('@/views/coupon/Detail'),
    meta: {
      intro: '卡券详细',
      requiresAuth: false
    }
  }, {
    path: '*',
    name: 'ErrorRoute',
    component: require('@/views/error/Route'),
    meta: {
      intro: '404错误'
    }
  }]
})
