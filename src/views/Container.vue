<template>
  <div class="mj">
    <subscribe-tool></subscribe-tool>
    <transition>
      <router-view></router-view>
    </transition>
    <mj-footer></mj-footer>
  </div>
</template>
<script>
import MJFooter from '@/components/Footer'
import SubscribeTool from '@/components/SubscribeTool'
import { storage } from '@/utils'

export default {
  name: 'container',
  created () {
    if (process.env.NODE_ENV === 'development') {
      storage({
        type: 'set',
        key: 'headimgurl',
        val: '//wx.qlogo.cn/mmopen/x9caeaMpHoWcicDmIZs0Ovicuibe1H0icp57ndKcmv4Rz0xB6khyCeSbN3miagPMuyHpia1JHraN9btZDAZibEBlaKJKkYiaGnDjic0Gic/0'
      })
      storage({
        type: 'set',
        key: 'nickname',
        val: '塞尔达'
      })
      storage({
        type: 'set',
        key: 'customerNo',
        val: 'MZA10235400'
      })
      storage({
        type: 'set',
        key: 'openid',
        val: 'oPg2ZwgwuALccM_V8UIW4qmhkOwo'
      })
      storage({
        type: 'set',
        key: 'mobile',
        val: ''
      })
      storage({
        type: 'set',
        key: 'mobile',
        val: ''
      })
      storage({
        type: 'set',
        key: 'subscribe',
        val: '1'
      })
      storage({
        type: 'set',
        key: 'userId',
        val: '212'
      })
      storage({
        type: 'set',
        key: 'token',
        val: 'eyJhbGciOiJIUzI1NiJ9.eyJ3eFVzZXJJZCI6MjEyLCJjcmVhdGVUaW1lIjoxNTE2NTg0OTUxMjc2LCJvcGVuaWQiOiJvUGcyWndpSDFBU0FfRWlBajEwWEhjQjJxZ2NNIn0.iNOERApCDxDRVa3LDbDZ1H8zEo5bCc-h7SSo6yhPdHI'
      })
      return
    }
  },
  components: {
    'mj-footer': MJFooter,
    'subscribe-tool': SubscribeTool
  },
  data () {
    return {
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
</style>
