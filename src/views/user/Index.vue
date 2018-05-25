<template>
  <div class="usercenter">
    <div class="usercenter-info">
      <div class="usercenter-info__container">
        <img :src="userinfo.headimgurl" alt="用户背景">
      </div>
      <div class="usercenter-info__detail">
        <div class="setting-elem">
          <router-link to="/user/setting">
            <img src="../../assets/images/setting.png" alt="">
          </router-link>
        </div>
        <div class="usercenter-info__detail--image">
          <img :src="userAvar" alt="用户头像" @click="usershow = true">
        </div>
        <p>{{userinfo.nickName}}</p>
      </div>
    </div>
    <div class="usercenter-orderfunc">
      <div class="usercenter-orderfunc-box flex" v-for="item in orderfunc" @click="goPath(item.path, item.func)" v-if="item.show">
        <div class="usercenter-orderfunc-box--info">
          <img :src="item.src" alt="">
          <span>{{item.name}}</span>
          <span class="drawing-pin" v-show="item.key === 'coupon'">{{couponsLen}}</span>
        </div>
        <span class="arrow-left"></span>
      </div>
    </div>
    <!-- 客服热线 -->
    <div v-transfer-dom>
      <x-dialog v-model="dialogshow" class="dialog-demo" hide-on-blur>
        <div class="customer-service">
          <p>{{'usercenter.customerservicephone' | translate}}:&nbsp;&nbsp;</p>
          <p><a :href="telHotline">{{hotline}}</a></p>
        </div>
        <div class="customer-service">
          <p>{{'usercenter.customerserviceqr' | translate}}:&nbsp;&nbsp;</p>
          <p>
            <img class="customer-qrpic" src="../../assets/images/wechat_customer.jpg" alt="客服二维码">
          </p>
        </div>
        <div class="package-close" @click="dialogshow = false">
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
          <p>{{'usercenter.wxnickname' | translate}}: {{userinfo.nickName}}</p>
          <p>
            <span>{{'usercenter.phoneno' | translate}}: </span>
            <span>{{userinfo.mobile}}</span>
            <span v-show="!userinfo.mobile">{{'usercenter.nophoneno' | translate}}</span>
            <span v-show="!userinfo.mobile">
              <router-link to="/bindphone">
                {{'usercenter.clicktobindphone' | translate}}
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
import { mapGetters } from 'vuex'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { storage } from '@/utils'
import { hotline } from '@/utils/config'
import logoPng from '@/assets/images/logo.jpg'
import { getUserinfo as getSpreadUserinfo } from '@/services/promote'
// import { query as queryCoupon } from '@/services/coupon'
import { getCouponByOpenId } from '@/services/coupon'

export default {
  name: 'usercenter',
  async created () {
    this.$store.commit('SET_PAGE', {page: 'usercenter'})
    this.hotline = hotline
    this.logoPng = logoPng
    this.getSpreadUser()
    // 获取优惠券数量
    this.getCouponNum()
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  computed: {
    ...mapGetters({
      userinfo: 'getUserInfo',
      userid: 'getUserId'
    }),
    userAvar () {
      return this.userinfo.headimgurl || this.logoPng
    },
    telHotline () {
      return 'tel:' + this.hotline
    },
    showRefresh () {
      if (process.env.NODE_ENV !== 'production') {
        return true
      } else {
        return false
      }
    },
    orderfunc () {
      return [{
        key: 'address',
        src: require('../../assets/images/min_ico_add.png'),
        name: this.$i18n.translate('usercenter.address'),
        path: '/address',
        show: true
      }, {
        key: 'customerservice',
        src: require('../../assets/images/min_ico_kef.png'),
        name: this.$i18n.translate('usercenter.customerservice'),
        func: 'showDialog',
        show: true
      }, {
        key: 'orderlist',
        src: require('../../assets/images/min_ico_pac.png'),
        name: this.$i18n.translate('usercenter.sendorder'),
        path: '/order/list',
        show: true
      }, {
        key: 'cargolist',
        src: require('../../assets/images/cargo_ico.png'),
        name: this.$i18n.translate('usercenter.cargoorder'),
        path: '/cargo/list',
        show: true
      }, {
        key: 'promote',
        src: require('../../assets/images/promote/sales.png'),
        name: this.$i18n.translate('usercenter.mysale'),
        path: '/promote',
        show: (this.spreadUserId !== null)
      }, {
        key: 'coupon',
        src: require('../../assets/images/coupon.png'),
        name: this.$i18n.translate('usercenter.mycoupon'),
        path: '/coupon',
        show: true
      }, {
        key: 'verifyrealname',
        src: require('../../assets/images/min_ico_rea.png'),
        name: this.$i18n.translate('usercenter.verifyrealname'),
        show: false
      }]
    }
  },
  mounted () {
  },
  data () {
    return {
      usershow: false,
      isShow: false,
      spreadUserId: null,
      isReresh: false,
      dialogshow: false,
      couponsLen: 0
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
    },
    async getCouponNum () {
      const openid = storage({key: 'openid'})
      try {
        const couponRes = await getCouponByOpenId({
          openId: openid,
          type: 0
        })
        if (couponRes.code === 200) {
          this.couponsLen = couponRes.obj.length
        }
      } catch (e) {
        console.error(e)
      }
    },
    refreshUser () {
      storage({
        type: 'clear'
      })
      this.$router.push({
        path: 'send'
      })
    },
    async getSpreadUser () {
      try {
        let wxUserId = this.userid
        const res = await getSpreadUserinfo({wxUserId})
        if (res.success && res.code === 200) {
          const userData = res.obj
          this.spreadUserId = userData.spreadUserId
        }
      } catch (err) {
        console.error(err)
      }
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
    p {
      font-size: @normal-size;
    }
  }
  .customer-qrpic {
    width: 10rem;
    height: auto;
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
  padding-bottom: 4vh;
  min-height: 94vh;
  .setting-elem {
    position: absolute;
    top: 2rem;
    right: 10px;
    img {
      width: 3.5rem;
      height: 3.5rem;
    }
  }
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

  .drawing-pin {
    background: red;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 1.2rem;
    color: white;
  }
}
</style>
