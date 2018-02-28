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
        key: 'openid',
        val: 'osdH7vw74PjKl4x8jvxplraC-tiE'
      })
      storage({
        type: 'set',
        key: 'unionid',
        val: 'ofgJC0pki0DBx7apxj1JObf7AUro'
      })
      storage({
        type: 'set',
        key: 'token',
        val: 'eyJhbGciOiJIUzI1NiJ9.eyJ3eFVzZXJJZCI6MjEyLCJjcmVhdGVUaW1lIjoxNTE5ODAzODU5MTE4LCJvcGVuaWQiOiJvUGcyWndpSDFBU0FfRWlBajEwWEhjQjJxZ2NNIn0.dkf7Q8cHd5WY5B0g1StihxjDB4jYif8gc1B6dx7jOkI'
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
