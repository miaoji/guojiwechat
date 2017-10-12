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
  name: 'contains',
  created () {
    if (process.env.NODE_ENV === 'development') {
      window.localStorage.setItem('mj_init', 'done')
      window.localStorage.setItem('mj_headimgurl', '//wx.qlogo.cn/mmopen/x9caeaMpHoWcicDmIZs0Ovicuibe1H0icp57ndKcmv4Rz0xB6khyCeSbN3miagPMuyHpia1JHraN9btZDAZibEBlaKJKkYiaGnDjic0Gic/0')
      window.localStorage.setItem('mj_nickname', '明华')
      window.localStorage.setItem('mj_openid', 'osdH7vw74PjKl4x8jvxplraC-tiE')
      window.localStorage.setItem('mj_mobile', '17602180495')
      // window.localStorage.setItem('mj_userId', '18')
      window.localStorage.setItem('mj_userId', '212')
      window.localStorage.setItem('mj_token', 'eyJhbGciOiJIUzI1NiJ9.eyJ3eFVzZXJJZCI6MTgsIm9wZW5pZCI6Im9zZEg3dnc3NFBqS2w0eDhqdnhwbHJhQy10aUUifQ.LeKzLIibWbRdWHxPpYoRrqzDS0Uvl8YQzjhIcIAZtx0')
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
@import '../assets/styles/colors.less';
@import '../assets/styles/init/index.less';
@import '../assets/styles/init/send.less';
@import '../assets/styles/init/address.less';
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
