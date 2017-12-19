<template>
  <div class="mj">
    <transition>
      <router-view></router-view>
    </transition>
    <mj-footer></mj-footer>
  </div>
</template>
<script>
import MJFooter from '@/components/Footer'

export default {
  name: 'container',
  created () {
    if (process.env.NODE_ENV === 'development') {
      window.localStorage.setItem('mj_headimgurl', '//wx.qlogo.cn/mmopen/x9caeaMpHoWcicDmIZs0Ovicuibe1H0icp57ndKcmv4Rz0xB6khyCeSbN3miagPMuyHpia1JHraN9btZDAZibEBlaKJKkYiaGnDjic0Gic/0')
      window.localStorage.setItem('mj_nickname', '明华')
      window.localStorage.setItem('mj_customerNo', 'MZA10235400')
      // window.localStorage.setItem('mj_openid', 'oPg2ZwiH1ASA_EiAj10XHcB2qgcM')
      window.localStorage.setItem('mj_openid', 'oPg2ZwgwuALccM_V8UIW4qmhkOwo')
      // window.localStorage.setItem('mj_mobile', '17602180495')
      window.localStorage.setItem('mj_mobile', '')
      // window.localStorage.setItem('mj_userId', '18')
      window.localStorage.setItem('mj_userId', '212')
      window.localStorage.setItem('mj_token', 'eyJhbGciOiJIUzI1NiJ9.eyJ3eFVzZXJJZCI6MjEyLCJjcmVhdGVUaW1lIjoxNTEzNjUwNTIzMDI5LCJvcGVuaWQiOiJvUGcyWndpSDFBU0FfRWlBajEwWEhjQjJxZ2NNIn0.-Sdv16U4PRtUhaZXGLKm1ccKFracVATL-JhIqhX8QAA')
      return
    }
  },
  components: {
    'mj-footer': MJFooter
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
