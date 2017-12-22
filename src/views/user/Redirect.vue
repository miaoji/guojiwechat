<template>
  <div class="redirect">
  </div>
</template>

<script>
import {storage} from '@/utils'

export default {
  created () {
    let {openid, unionid} = this.$route.query
    if (!openid && !unionid) {
      this.$vux.toast.show({
        type: 'text',
        width: '20rem',
        time: '1500',
        text: '获取用户信息失败，请联系客服人员'
      })
      return this.$router.push({path: '/nouser'})
    }
    // 删除openid, unionid
    storage({
      key: 'openid',
      type: 'remove'
    })
    // 存入新的openid, unionid
    storage({
      key: 'openid',
      val: openid,
      type: 'set'
    })
    storage({
      key: 'unionid',
      val: unionid,
      type: 'set'
    })
    this.$router.push({path: '/init'})
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
</style>
