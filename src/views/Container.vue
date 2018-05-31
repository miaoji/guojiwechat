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
import config from 'config'
import MJFooter from '@/components/Footer'
import SubscribeTool from '@/components/SubscribeTool'
import { storage } from '@/utils'
import { getToken } from '@/services/developmentToken'

export default {
  name: 'container',
  async created () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      const data = await getToken()
      if (config.dev.developer === 'winnerwly' || config.test.developer === 'winnerwly') {
        storage({
          type: 'set',
          key: 'openid',
          val: 'oPg2Zwkc9-yHFoWv2ZcIjDd12i4I'
        })
        storage({
          type: 'set',
          key: 'unionid',
          val: 'ofgJC0uljrqfl60mFA1TbSW1bdJY'
        })
      } else {
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
      }
      storage({
        type: 'set',
        key: 'token',
        val: data.stringData
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
