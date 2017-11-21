<template>
  <div class="usercenter">
    <div class="usercenter-info">
      <div class="usercenter-info__container">
        <img :src="userAvar" alt="用户背景">
      </div>
      <div class="usercenter-info__detail">
        <div class="usercenter-info__detail--image">
          <img :src="userAvar" alt="用户头像" @click="usershow = true">
        </div>
        <p>{{nickname}}</p>
      </div>
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
    <!-- 客服热线 -->
    <div v-transfer-dom>
      <x-dialog v-model="dialogshow" class="dialog-demo" hide-on-blur>
        <div class="customer-service">
          <p>客服热线:&nbsp;&nbsp;</p>
          <p><a :href="telHotline">{{hotline}}</a></p>
        </div>
        <div @click="dialogshow = false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
    <!-- 用户信息展示 -->
    <div v-transfer-dom>
      <x-dialog v-model="usershow" class="user-dialog" hide-on-blur>
        <div class="img-box" :style="'background-image:url(' + userAvar + ')'">
        </div>
        <div class="user-info">
          <p>微信昵称: {{nickname}}</p>
          <p>手机号: {{mobile || '未绑定手机号'}} 
            <span v-show="!mobile">
              <router-link to="/bindphone">
                点击此处绑定
              </router-link>
            </span>
          </p>
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
import { storage } from '@/utils'
import { hotline } from '@/utils/config'
import logoPng from '@/assets/images/logo.png'

export default {
  name: 'usercenter',
  async created () {
    this.$store.commit('SET_PAGE', {page: 'usercenter'})
    this.hotline = hotline
    this.headImgUrl = storage({key: 'headimgurl'}) || ''
    this.nickname = storage({key: 'nickname'}) || '未知用户'
    this.mobile = storage({key: 'mobile'})
    this.logoPng = logoPng
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  computed: {
    userAvar () {
      return this.headImgUrl || this.logoPng
    },
    telHotline () {
      return 'tel:' + this.hotline
    }
  },
  mounted () {
  },
  data () {
    return {
      usershow: false,
      isShow: false,
      headImgUrl: '',
      nickname: '',
      mobile: '',
      orderfunc: [{
        src: require('../../assets/images/min_ico_add.png'),
        name: '地址管理',
        path: '/address',
        show: true
      }, {
        src: require('../../assets/images/min_ico_kef.png'),
        name: '客服中心',
        func: 'showDialog',
        show: true
      }, {
        src: require('../../assets/images/min_ico_pac.png'),
        name: '我的包裹',
        path: '/order/list',
        show: true
      }, {
        src: require('../../assets/images/cargo_ico.png'),
        name: '集运订单',
        path: '/cargo/list',
        show: true
      }, {
        src: require('../../assets/images/coupon.png'),
        name: '我的卡包',
        path: '/coupon',
        show: true
      }, {
        src: require('../../assets/images/min_ico_rea.png'),
        name: '实名认证',
        show: false
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
@import '../../assets/styles/colors.less';
@import '../../assets/styles/vars.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.dialog-demo {
  .customer-service {
    .flex;
    padding: 1rem;
    font-size: @normal-size;
    a {
      font-size: @normal-size;
      color: @m-yellow;
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
      color: @m-yellow;
      font-size: @normal-size;
      text-align: left;
    }
  }
  .user-close {
    padding: 10px 0;
  }
}

.usercenter-padding {
  padding: 1rem;
}

.usercenter {
  .purple-bg;
  padding: 10px;
  padding-top: 4vh;
  min-height: 94vh;
  overflow: hidden;
  &-info {
    margin: 0;
    padding: 0;
    border-radius: @radius-size @radius-size 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 15rem;
    &__container {
      filter: blur(10px);
      img {
        width: 50rem;
        margin-top: -25rem;
        height: 50rem;
      }
    }
    &__detail {
      position: absolute;
      width: 100%;
      &--image {
        padding: 2rem 0 1.8rem 0;
        img {
          width: 7.5rem;
          border-radius: 50%;
        }
      }
      p {
        margin-bottom: -1px;
        background-color: rgba(57, 58, 63, .5);
        color: white;
        font-size: @middle-size;
        padding: .5rem 0;
        width: 100%;
        text-align: center;
      }
    }
  }

  &-orderfunc {
    flex-wrap: wrap;
    &-box {
      justify-content: space-between;
      padding: 1rem .5rem;
      padding-left: 1rem;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid @borderbt;
      border-top-width: 0;
      &--info {
        flex: 3;
        text-align: left;
        img {
          width: 2.1rem;
          height: auto;
          margin-right: 9px;
          vertical-align:middle;
          font-size: 0;
        }
        span {
          font-size: @normal-size;
        }
      }
      .arrow-left {
        flex: 1;
        height: 1.3rem;
        background: url('../../assets/images/sen_ico_arr.png') no-repeat;
        background-size: 0.9rem 1.3rem;
        background-position-x: 87%;
      }
    }
  }
}
</style>
