import Vue from 'vue'
import Router from 'vue-router'

import Container from '@/views/Container'

Vue.use(Router)

export default new Router({
  base: __dirname,
  routes: [{
    path: '/',
    name: 'Container',
    component: Container,
    children: [{
      path: '/index',
      name: 'Index',
      component: require('@/views/Index')
    }, {
      path: '/usercenter',
      name: 'UserCenter',
      component: require('@/views/UserCenter'),
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/send',
      name: 'Send',
      component: require('@/views/Send'),
      meta: {
        intro: '寄件',
        requiresAuth: true
      }
    }]
  }, {
    path: '/address',
    name: 'Address',
    component: require('@/views/Address'),
    meta: {
      intro: '地址簿',
      requiresAuth: true
    }
  }, {
    path: '/address/add',
    name: 'AddAddress',
    component: require('@/views/AddAddress'),
    meta: {
      intro: '添加地址',
      requiresAuth: true
    }
  }, {
    path: '/address/edit',
    name: 'EditAddress',
    component: require('@/views/EditAddress'),
    meta: {
      intro: '编辑地址',
      requiresAuth: true
    }
  }, {
    path: '/bindphone',
    name: 'BindPhone',
    component: require('@/views/BindPhone')
  }, {
    path: '/redirect',
    name: 'Redirect',
    component: require('@/views/Redirect')
  }, {
    path: '/init',
    name: 'Init',
    component: require('@/views/Init')
  }, {
    path: '/nouser',
    name: 'NoUser',
    component: require('@/views/NoUser')
  }, {
    path: '/order/list',
    name: 'OrderList',
    component: require('@/views/OrderList'),
    meta: {
      intro: '订单列表',
      requiresAuth: true
    }
  }, {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: require('@/views/OrderDetail'),
    meta: {
      intro: '订单详情',
      requiresAuth: true
    }
  }, {
    path: '/bootdeal',
    name: 'BootDeal',
    component: require('@/views/BootDeal'),
    meta: {
      intro: '补价处理页面',
      requiresAuth: false
    }
  }, {
    path: '/bootlist',
    name: 'BootList',
    component: require('@/views/BootList'),
    meta: {
      intro: '补价记录',
      requiresAuth: false
    }
  }]
})
