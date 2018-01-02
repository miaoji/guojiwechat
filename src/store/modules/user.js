import {show, getOpenid, bindPhone} from '@/services/user'
import {send as sendSms} from '@/services/sms'
import { storage } from '@/utils'
import * as types from '../mutation-types'

export const state = {
  userId: null,
  mobile: '',
  nickname: '',
  headimgurl: '',
  openid: '',
  smscode: ''
}

export const getters = {
  getUserId: state => {
    const userId = storage({key: 'userId'}) || ''
    return userId
  },
  getUserInfo: state => {
    const headimgurl = storage({key: 'headimgurl'}) || ''
    const mobile = storage({key: 'mobile'}) || ''
    const nickname = storage({key: 'nickname'}) || ''
    const subscribe = storage({key: 'subscribe'}) || ''
    return {
      headimgurl,
      mobile,
      nickname,
      subscribe
    }
  },
  getOpenId: state => {
    const openid = storage({key: 'openid'}) || ''
    return openid
  },
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
        let user = res.user
        commit(types.SET_USERINFO, {
          token: res.token,
          userId: user.id,
          mobile: user.mobile,
          headimgurl: user.headimgurl,
          nickname: user.nickName,
          customerNo: user.customerNo,
          subscribe: user.subscribe
        })
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
  [types.SET_USERINFO] (state, {
    token = storage({key: 'token'}),
    userId = storage({key: 'userId'}),
    mobile = storage({key: 'mobile'}),
    nickname = storage({key: 'nickname'}),
    headimgurl = storage({key: 'headimgurl'}),
    customerNo = storage({key: 'customerNo'}),
    subscribe = storage({key: 'subscribe'})
  }) {
    storage({key: 'token', val: token, type: 'set'})
    storage({key: 'userId', val: userId, type: 'set'})
    storage({key: 'mobile', val: mobile, type: 'set'})
    storage({key: 'nickname', val: nickname, type: 'set'})
    storage({key: 'headimgurl', val: headimgurl, type: 'set'})
    storage({key: 'customerNo', val: customerNo, type: 'set'})
    storage({key: 'subscribe', val: subscribe, type: 'set'})
  },
  [types.SET_OPENID] (state, { openid }) {
    state.openid = openid
  },
  [types.SET_SMSCODE] (state, { smscode }) {
    state.smscode = smscode
  }
}
