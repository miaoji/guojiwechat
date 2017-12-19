import Vue from 'vue'
import Router from 'vue-router'

import Container from '@/views/Container'
import FeedContainer from '@/views/feed/Container'

Vue.use(Router)

const usercenter = r => require.ensure([], () => r(require('@/views/user')), 'Usercenter')
const userinfo = r => require.ensure([], () => r(require('@/views/user/info')), 'UserInfo')
const send = r => require.ensure([], () => r(require('@/views/send')), 'Send')
const cargo = r => require.ensure([], () => r(require('@/views/cargo')), 'Cargo')
const assess = r => require.ensure([], () => r(require('@/views/assess')), 'Assess')
const address = r => require.ensure([], () => r(require('@/views/address')), 'Address')
const handleaddress = r => require.ensure([], () => r(require('@/views/address/Handle')), 'HandleAddress')
const bindphone = r => require.ensure([], () => r(require('@/views/user/BindPhone')), 'BindPhone')
const redirect = r => require.ensure([], () => r(require('@/views/user/Redirect')), 'Redirect')
const init = r => require.ensure([], () => r(require('@/views/user/Init')), 'Init')
const nouser = r => require.ensure([], () => r(require('@/views/error/NoUser')), 'NoUser')
const notwechat = r => require.ensure([], () => r(require('@/views/error/NotWechat')), 'notwechat')
const orderlist = r => require.ensure([], () => r(require('@/views/order/List')), 'OrderList')
const orderdetail = r => require.ensure([], () => r(require('@/views/order/Detail')), 'OrderDetail')
const orderroute = r => require.ensure([], () => r(require('@/views/order/Route')), 'OrderRoute')
const bootdeal = r => require.ensure([], () => r(require('@/views/boot/Deal')), 'BootDeal')
const bootlist = r => require.ensure([], () => r(require('@/views/boot/List')), 'BootList')
const payresult = r => require.ensure([], () => r(require('@/views/pay/Result')), 'PayResult')
const feedrecommend = r => require.ensure([], () => r(require('@/views/feed/Recommend')), 'FeedContainer')
const couponlist = r => require.ensure([], () => r(require('@/views/coupon/List')), 'CouponList')
const coupondetail = r => require.ensure([], () => r(require('@/views/coupon/Detail')), 'CouponDetail')
const cargolist = r => require.ensure([], () => r(require('@/views/cargo/List')), 'CargoList')

export default new Router({
  base: __dirname,
  routes: [{
    path: '/',
    name: 'Container',
    component: Container,
    children: [{
      path: '/usercenter',
      name: 'UserCenter',
      component: usercenter,
      meta: {
        intro: '个人中心',
        requiresAuth: true
      }
    }, {
      path: '/send',
      name: 'Send',
      component: send,
      meta: {
        intro: '直邮',
        requiresAuth: true
      }
    }, {
      path: '/cargo',
      name: 'Cargo',
      component: cargo,
      meta: {
        intro: '集运',
        requiresAuth: true
      }
    }]
  }, {
    path: '/address',
    name: 'Address',
    component: address,
    meta: {
      intro: '地址簿',
      requiresAuth: true
    }
  }, {
    path: '/assess',
    name: 'Assess',
    component: assess,
    meta: {
      intro: '运费估算',
      requiresAuth: true
    }
  }, {
    path: '/address/handle',
    name: 'HandleAddress',
    component: handleaddress,
    meta: {
      intro: '添加/编辑地址',
      requiresAuth: true
    }
  }, {
    path: '/bindphone',
    name: 'BindPhone',
    component: bindphone,
    meta: {
      intro: '绑定手机',
      requiresAuth: true
    }
  }, {
    path: '/redirect',
    name: 'Redirect',
    component: redirect,
    meta: {
      intro: '跳转',
      requiresAuth: false
    }
  }, {
    path: '/init',
    name: 'Init',
    component: init,
    meta: {
      intro: '初始化',
      requiresAuth: false
    }
  }, {
    path: '/nouser',
    name: 'NoUser',
    component: nouser,
    meta: {
      intro: '没有该用户',
      requiresAuth: false
    }
  }, {
    path: '/notwechat',
    name: 'notwechat',
    component: notwechat,
    meta: {
      intro: '请在微信中访问',
      requiresAuth: false
    }
  }, {
    path: '/order/list',
    name: 'OrderList',
    component: orderlist,
    meta: {
      intro: '订单列表',
      requiresAuth: true
    }
  }, {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: orderdetail,
    meta: {
      intro: '订单明细',
      requiresAuth: true
    }
  }, {
    path: '/orderroute',
    name: 'OrderRoute',
    component: orderroute,
    meta: {
      intro: '物流信息',
      requiresAuth: true
    }
  }, {
    path: '/bootdeal',
    name: 'BootDeal',
    component: bootdeal,
    meta: {
      intro: '补价处理',
      requiresAuth: true
    }
  }, {
    path: '/bootlist',
    name: 'BootList',
    component: bootlist,
    meta: {
      intro: '补价记录',
      requiresAuth: true
    }
  }, {
    path: '/payresult',
    name: 'PayResult',
    component: payresult,
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
      component: feedrecommend,
      meta: {
        requiresAuth: true
      }
    }]
  }, {
    path: '/coupon',
    name: 'CouponList',
    component: couponlist,
    meta: {
      intro: '卡券列表',
      requiresAuth: true
    }
  }, {
    path: '/coupon/detail',
    name: 'CouponDetail',
    component: coupondetail,
    meta: {
      intro: '卡券详细',
      requiresAuth: true
    }
  }, {
    path: '/user/info',
    name: 'UserInfo',
    component: userinfo,
    meta: {
      intro: '用户信息',
      requiresAuth: true
    }
  }, {
    path: '*',
    name: 'ErrorRoute',
    component: require('@/views/error/Route'),
    meta: {
      intro: '404错误'
    }
  }, {
    path: '/cargo/list',
    name: 'CargoList',
    component: cargolist,
    meta: {
      intro: '集运列表',
      requiresAuth: true
    }
  }]
})
