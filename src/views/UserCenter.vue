<template>
  <div class="usercenter">
    <div class="usercenter-info"> 
      <img :src="user.headimgurl" :alt="user.nickname" @click="usershow = true">
      <p>{{user.nickname}}</p>
    </div>
    <div class="usercenter-orderfunc">
      <div class="usercenter-orderfunc-box flex" v-for="item in orderfunc" @click="goPath(item.path, item.func)" v-if="item.show">
        <div class="usercenter-orderfunc-box--info">
          <img :src="item.src" alt="">
          <span>{{item.name}}</span>
        </div>
        <span class="arrow-left"></span>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="dialogshow" class="dialog-demo" hide-on-blur>
        <div class="customer-service flex">
          <p>客服热线:&nbsp;&nbsp;</p>
          <p><a href="tel:021-60314051">021-60314051</a></p>
        </div>
        <div @click="dialogshow = false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="usershow" class="user-dialog" hide-on-blur>
        <div class="img-box" :style="'background-image:url(' + user.headimgurl + ')'">
        </div>
        <div class="user-info">
          <p>微信昵称: {{user.nickname}}</p>
          <p>手机号: {{user.mobile}}</p>
        </div>
        <div @click="usershow = false">
          <span class="vux-close user-close"></span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'

export default {
  name: 'usercenter',
  async created () {
    this.$store.commit('SET_PAGE', {page: 'usercenter'})
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  computed: {
    ...mapGetters({
      user: 'getUserInfo',
      userid: 'getUserId',
      openid: 'getOpenId'
    })
  },
  mounted () {
    window.document.title = '我的'
  },
  data () {
    return {
      usershow: false,
      isShow: false,
      orderfunc: [{
        src: require('../assets/images/min_ico_add.png'),
        name: '地址管理',
        path: '/address',
        show: true
      }, {
        src: require('../assets/images/min_ico_pac.png'),
        name: '我的包裹',
        path: '/order/list',
        show: true
      }, {
        src: require('../assets/images/min_ico_rea.png'),
        name: '实名认证',
        show: false
      }, {
        src: require('../assets/images/min_ico_cus.png'),
        name: '客服中心',
        func: 'showDialog',
        show: true
      }],
      isReresh: false,
      dialogshow: false
    }
  },
  methods: {
    goPath (path, func) {
      if (!path && !func) {
        this.$vux.toast.show({
          text: '暂未开放',
          type: 'warn',
          width: '16rem'
        })
        return
      }
      if (!path && func) {
        this[func]()
        return
      }
      if (path) {
        this.$router.push({path})
        return
      }
    },
    showDialog () {
      this.dialogshow = true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '~vux/src/styles/close';
.dialog-demo {
  .weui-dialog{
    padding: 1rem 1rem 8px 1rem;
    border-radius: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .customer-service {
    padding: 1rem;
    font-size: 1.6rem;
    a {
      color: @red;
    }
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.user-dialog {
  .img-box {
    height: 350px;
    overflow: hidden;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    filter: blur(15px);
  }
  .user-info {
    position: absolute;
    top: 0;
    padding: 15px;
    p {
      color: white;
      font-size: 1.4rem;
      text-align: left;
    }
  }
  .user-close {
    padding: 10px 0;
  }
}
.flex {
  display: flex;
  align-items: center;
}

.roate-change {
  animation: roate 1s ease both alternate;
  animation-iteration-count: 1;
  animation-delay: -0.1s;
  animation-fill-mode: forwards;
  // animation-direction: reverse;
}

@keyframes roate {
  0% {
    transform: scale(2.5) rotate(0deg);
  }
  50% {
    transform: scale(1) rotate(36000deg);
  }
  70% {
    transform: scale(1.5) rotate(7200000deg);
  }
  100% {
    transform: scale(1) rotate(720000000deg);
  }
}

.usercenter-padding {
  padding: 1rem;
}

.arrow-top {
  transform: rotate(180deg);
}

.usercenter {
  overflow: hidden;
  padding: 1.2rem;
  &-info {
    padding: 2rem;
    background: @greybg;
    overflow: hidden;
    position: relative;
    height: 11rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 7.2rem;
      border-radius: 50%;
    }
    p {
      color: white;
      font-size: 1.6rem;
      padding: 1rem 0 0 0;
      // position: absolute;
      // top: 11rem;
      width: 100%;
      text-align: center;
    }
  }

  &-balance {
    justify-content: space-between;
    padding: .6rem 1rem;
    font-size: 1.6rem;
    font-weight: 600;
    background: white;
    img {
      padding-left: 1rem;
      width: 1rem;
      vertical-align: middle;
    }
  }

  &-orderfunc {
    flex-wrap: wrap;
    &-box {
      justify-content: space-between;
      padding: 1.2rem .5rem;
      padding-left: 1rem;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid @borderbt;
      border-top-width: 0;
      &--info {
        flex: 3;
        text-align: left;
        img {
          width: 1.9rem;
          height: auto;
          margin-right: 7px;
          vertical-align:middle;
          font-size: 0;
        }
        span {
          font-size: 1.6rem;
        }
      }
      .arrow-left {
        flex: 1;
        height: 1.3rem;
        background: url('../assets/images/sen_ico_arr.png') no-repeat;
        background-size: 0.9rem 1.3rem;
        background-position-x: 80%;
      }
    }
  }
}
</style>
