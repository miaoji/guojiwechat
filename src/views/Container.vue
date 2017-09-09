<template>
  <div class="mj">
    <transition name="">
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
      window.localStorage.setItem('mj_userId', '36')
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
.mj {
  min-height: 100vh;
  background-color: @bg-grey;
}

.bounce-enter-active {
  animation: bounce-in .4s;
}
.bounce-leave-active {
  animation: bounce-out .5s;
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
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}

.expand-enter-active {
  animation: expand-in .9s;
}
.expand-leave-active {
  animation: expand-out 1.2s;
}
@keyframes expand-in {
  0% {
    margin-top: 1rem;
    transform: scale(.6) translateX(-1500px);
  }
  25% {
    margin-top: 1rem;
    transform: scale(.6) translateX(200px);
  }
  50% {
    margin-top: 1rem;
    transform: scale(.6) translateX(200px);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes expand-out {
  0% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6);
  }
  9% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6);
  }
  10% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6) translateX(100px);
  }
  25% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6) translateX(200px);
  }
  50% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6) translateX(250px);
  }
  75% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(.6) translateX(-1000px);
  }
  100% {
    margin-top: 1rem;
    transform: scaleX(.8) scaleY(0) translateX(-1000px);
  }
}

.address-scroller {
  .loading-layer {
    height: 120px!important;
  }
}

.editaddress {
  .weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    border-color: @red;
    background-color: @red;
  }  
}

.addaddress {
  .weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    border-color: @red;
    background-color: @red;
  }  
}

</style>
