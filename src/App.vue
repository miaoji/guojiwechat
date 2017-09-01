<template>
  <div id="app">
    <router-view></router-view>
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'app',
  created () {
  },
  data () {
    return {
    }
  },
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isJump: state => state.isJump,
      jumpSrc: state => state.jumpSrc
    }),
    ...mapGetters({
      'openid': 'getOpenId'
    })
  },
  methods: {
    ...mapActions([
      'setOpenid',
      'setUserInfo'
    ])
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './assets/styles/colors.less';

html,body{
  font-size: 10px;
  padding: 0;
  margin: 0;
}

body {
  background-color: #efeff4;
}

@media screen and (min-width:321px) and (max-width:375px){html{font-size:10px}}
@media screen and (min-width:376px) and (max-width:414px){html{font-size:10px}}
@media screen and (min-width:415px) and (max-width:639px){html{font-size:12px}}
@media screen and (min-width:640px) and (max-width:719px){html{font-size:12px}}
@media screen and (min-width:720px){html{font-size:16px}}
@media screen and (min-width:750px) and (max-width:799px){html{font-size:23.5px}}
@media screen and (min-width:800px)and (max-width:1199px){html{font-size:25px}}
@media screen and (min-width:1200px){html{font-size:30px}}

#app {
	font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

select,option,textarea {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
}

.loading-img {
  position: absolute;
  top: 20%;
  left: 0;
  width: 100%;
  height: auto;
}

.pic-enter-active {
  animation: pic-in .5s;
}
.pic-leave-active {
  animation: pic-out .5s;
}
.weui-dialog__btn_primary {
    color: @red;
}

@keyframes pic-in {
  0% {
    transform: scale(0) rotate3d(360,360,360,360deg);
  }
  50% {
    transform: scale(1.5) rotate3d(120,120,120,120deg);
  }
  100% {
    transform: scale(1) rotate3d(0,0,0,0deg);
  }
}
@keyframes pic-out {
  0% {
    transform: scale(1) rotate3d(0,0,0,0deg);
  }
  50% {
    transform: scale(1.5) rotate3d(120,120,120,120deg);
  }
  100% {
    transform: scale(0) rotate3d(360,360,360,360deg);
  }
}
.amap-ui-smp-ifwn-content-body {
  border: none!important;
}

.weui-toast {
  z-index: 6000;
}

.addaddress {
  .weui-cell__bd.weui-cell__primary {
    input {
      text-align: right;
    }
  }
}

.editaddress {
  .weui-cell__bd.weui-cell__primary {
    input {
      text-align: right;
    }
  }
}

.orderdetail {
  .orderdetail-detail-box__content {
    .weui-loadmore {
      margin: 0 auto;
    }
  }
}

</style>
