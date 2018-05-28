<template>
  <div class="list">
    <div class="list-tab">
      <tab v-if="type !== 'select'" active-color='#ffa414'>
        <tab-item selected @on-item-click="onTabClick">可用优惠券</tab-item>
        <tab-item @on-item-click="onTabClick">已失效优惠券</tab-item>
      </tab>
    </div>
    <div class="list-tab">
      <tab :line-width=0 v-show="type === 'select'" active-color='#ffa414'>
        <tab-item selected >选择优惠使用</tab-item>
      </tab>
    </div>
    <div class="list-container">
      <div class="none-coupon" v-show="couponsResultMap.length === 0">
        <img src="../../assets/images/coupon_none_2.png" alt="">
        <p>{{'coupon.nocoupon' | translate}}</p>
      </div>
      <div v-for="item in couponsResultMap" :key="item.id">
        <list-item
          :name="item.couponCode"
          :data="item"
          :func="item.couponMoney"
          :endtime="item.endtime"
          :totalFee="totalFee"
          :type="type"
        >
        </list-item>
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中..."></loading>
    </div>
    <div class="list-footer">
      <tab :line-width=0 v-show="type === 'select'" active-color='#8a3ec2'>
        <tab-item @on-item-click="onFooterTabClick">选好了</tab-item>
      </tab>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { getCouponByOpenId } from '@/services/coupon'
import ListItem from './components/ListItem'
import { Tab, TabItem, Loading, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'list',
  data () {
    return {
      type: 'select',
      totalFee: '',
      coupons: [],
      showLoading: false,
      openid: ''
    }
  },
  async created () {
    const { type, totalFee } = this.$route.query
    this.type = type
    this.totalFee = totalFee
    this.$vux.loading.show()
    this.openid = storage({key: 'openid'})
    try {
      const couponList = await getCouponByOpenId({openId: this.openid, type: 0})
      if (couponList.code === 200 && couponList.obj) {
        let successlist = []
        let errorList = []
        if (type === 'select') {
          const now = new Date().getTime()
          couponList.obj.map((item) => {
            if (item.couponType.expiryDate > now && item.couponType.couponThreshold < totalFee) {
              successlist.push(item)
            } else {
              errorList.push(item)
            }
          })
          this.coupons = [...successlist, ...errorList]
        } else {
          this.coupons = couponList.obj
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.$vux.loading.hide()
    }
  },
  directives: {
    TransferDom
  },
  components: {
    ListItem,
    Tab,
    TabItem,
    Loading
  },
  computed: {
    couponsResultMap () {
      const coupons = this.coupons
      let res = []
      if (this.coupons === []) {
        return res
      }
      res = coupons.map((item) => {
        const {id, ...couponType} = item.couponType
        return {
          id: item.id,
          couponCode: item.couponCode,
          status: item.status,
          ...couponType,
          couponid: id,
          endtime: couponType.expiryDate
        }
      })
      return res
    }
  },
  methods: {
    onFooterTabClick () {
      this.$router.push('/send')
    },
    async onTabClick (index) {
      this.showLoading = true
      // type 1表示查询有效的优惠券 0表示查询失效优惠券
      const couponList = await getCouponByOpenId({openId: this.openid, type: index})
      if (couponList.code === 200 && couponList.obj) {
        this.coupons = couponList.obj
        this.showLoading = false
      } else {
        this.coupons = []
        this.showLoading = false
      }
    }
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.toast.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.active-1 {
  color: rgb(55, 174, 252) !important;
  border-bottom: 3px solid rgb(55, 174, 252) !important;
}
.list {
  min-height: 100vh;
  background: -webkit-linear-gradient(#571d79, #873ec1); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#571d79, #873ec1); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#571d79, #873ec1); /* Firefox 3.6 - 15 */
  background: linear-gradient(#571d79, #873ec1); /* 标准的语法 */
  &-tab {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  &-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .vux-tab-item {
      background-color: #ffa414;
      font-size: 1.4rem;
      color: #fff;
    }
    .vux-tab-disabled {
      color: #bbb!important;
    }
  }
  &-container {
    padding-top: 50px;
    padding-bottom: 4rem;
    .none-coupon {
      padding: 2rem;
      img {
        width: 10rem;
        height: 10rem;
      }
      p {
        font-size: 1.6rem;
        color: #fff;
      }
    }
  }
}
</style>
