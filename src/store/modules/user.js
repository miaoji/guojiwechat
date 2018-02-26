import {show, getOpenid, bindPhone} from '@/services/user'
import {send as sendSms} from '@/services/sms'
import { storage } from '@/utils'
import * as types from '../mutation-types'

export const state = {
  userinfo: {},
  openid: '',
  smscode: ''
}

export const getters = {
  getUserId: state => {
    const userId = state.userinfo.id || ''
    return userId
  },
  getUserInfo: state => state.userinfo,
  getSmsCode: state => state.smscode
}

export const actions = {
  /**
   * [根据openid获取用户信息]
   * @param {[type]} options.dispatch [description]
   * @param {[type]} options.commit   [description]
   * @param {[type]} options.openid   [description]
   */
  async setUserInfo ({ dispatch, commit }, {openid, unionid}) {
    try {
      const res = await show({
        openid,
        unionid,
        type: 0
      })
      if (res.statusCode === 200) {
        storage({
          type: 'set',
          key: 'token',
          val: res.token
        })
        let userinfo = res.user
        commit(types.SET_USERINFO, {userinfo})
        return {
          text: '获取用户信息成功',
          width: '15rem',
          type: 'success'
        }
      }
      return {
        text: '获取用户信息失败',
        width: '15rem',
        type: 'warn'
      }
    } catch (err) {
      console.error(err)
      return {
        text: '获取用户信息失败, 网络错误',
        width: '15rem',
        type: 'warn'
      }
    }
  },
  async setOpenid ({ commit }, {appid, secret, code}) {
    try {
      const url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code'
      const res = await getOpenid({
        url
      })
      if (res.statusCode === 200) {
        if (res.errcode) {
          return {
            text: res.errmsg,
            type: 'warn'
          }
        }
        let openid = res.openid
        storage({key: 'openid', type: 'remove'})
        storage({key: 'openid', val: openid, type: 'set'})
        commit(types.SET_OPENID, {openid})
        return {
          text: '获取用户openid成功',
          type: 'success',
          openid
        }
      }
      return {
        text: '获取用户openid失败',
        type: 'warn'
      }
    } catch (err) {
      console.error(err)
      return {
        text: '获取用户openid失败, 网络错误',
        type: 'warn'
      }
    }
  },
  /**
   * [发送短信]
   */
  async smsSend ({commit}, {mobile}) {
    try {
      const res = await sendSms({
        mobile
      })
      if (res.code === 200 || res.code === 201) {
        commit(types.SET_SMSCODE, {smscode: res.obj})
        return {
          text: res.mess,
          type: 'success',
          width: '18rem'
        }
      }
      return {
        text: '发送短信失败',
        type: 'warn',
        width: '18rem'
      }
    } catch (err) {
      console.error(err)
      return {
        text: '网络错误',
        type: 'warn',
        width: '18rem'
      }
    }
  },
  /**
   * [用户绑定手机号]
   * @param  {[type]} options.mobile   [description]
   * @param  {[type]} options.openid   [description]
   * @return {[type]}                  [description]
   */
  async bindUser ({dispatch, commit}, {mobile, openid}) {
    try {
      const res = await bindPhone({
        mobile,
        openid
      })
      const data = res.data
      const code = data.code
      if (code === 200) {
        return {
          text: data.mess,
          type: 'success'
        }
      } else if (code === 201) {
        return {
          text: data.mess,
          width: '15rem',
          type: 'warn'
        }
      }
      return {
        text: data.mess || '绑定帐号失败',
        type: 'warn',
        width: '15rem'
      }
    } catch (err) {
      console.error(err)
      return {
        text: '网络错误',
        type: 'warn',
        width: '15rem'
      }
    }
  }
}

export const mutations = {
  [types.SET_USERINFO] (state, {userinfo}) {
    state.userinfo = userinfo
  },
  [types.SET_OPENID] (state, { openid }) {
    state.openid = openid
  },
  [types.SET_SMSCODE] (state, { smscode }) {
    state.smscode = smscode
  }
}
