<template>
  <div id="init">
    <h1>正在跳转。。。</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { storage, getConfByEnv } from '@/utils'
// 微信公众号appid等配置
let conf = getConfByEnv()
let appid = conf.appid
let redirectUri = conf.redirectUri
export default {
  name: 'init',
  async created () {
    this.$vux.toast.show({
      type: 'text',
      width: '18rem',
      time: '1500',
      text: '正在为您跳转，请稍候'
    })
    // 从localstorage中获取openid
    const openid = storage({key: 'openid'})
    if (openid) {
      // 通过openid从数据库中查询用户数据
      await this.getUserInfoByOpenid({openid})
    } else {
      // 获取openid失败, 跳转到授权页面
      let state = storage({
        key: 'appid'
      })
      const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirectUri + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect'
      window.location.href = url
      return
    }
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
      'setUserInfo'
    ]),
    getDate (val = 30) {
      let time = new Date()
      const expireNew = {
        'now': new Date().getTime(),
        'expire': time.setMinutes(time.getMinutes() + val, time.getSeconds(), 0)
      }
      storage({key: 'expire', val: JSON.stringify(expireNew), type: 'set'})
    },
    async getUserInfoByOpenid ({openid}) {
      const userinfo = await this.setUserInfo({openid})
      if (userinfo.type === 'text') {
        // 用户未绑定手机， 跳转绑定手机页面
        this.$router.push({path: '/bindphone'})
        return
      } else if (userinfo.type === 'success') {
        // 获取用户信息成功, 根据page跳转页面
        // 获取当前时间14400分钟后时间戳, 并保存
        this.getDate(14400)
        this.$vux.toast.show({
          type: 'success',
          text: '登录成功',
          width: '16rem'
        })
        let path = storage({key: 'redirect_uri'}) || '/usercenter'
        this.$router.push(path)
        return
      } else {
        storage({key: 'openid', type: 'remove'})
        return this.$router.push({path: '/nouser'})
      }
    }
  }
}
</script>

<style lang="less">
</style>
