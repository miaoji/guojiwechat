<template>
  <div class="list">
    <tab v-if="type !== 'select'" active-color='#8a3ec2'>
      <tab-item selected @on-item-click="onTabClick">可用优惠券</tab-item>
      <tab-item @on-item-click="onTabClick">已失效优惠券</tab-item>
    </tab>
    <div class="list-container">
      <div class="none-coupon" v-show="couponsResultMap.length === 0">
        <img src="../../assets/images/coupon_none.png" alt="">
        <p>{{'coupon.nocoupon' | translate}}</p>
      </div>
      <div v-for="item in couponsResultMap" :key="item.id">
        <list-item
          :name="item.couponCode"
          :data="item"
          :func="item.couponMoney"
          :endtime="item.endtime"
          :totalFee="totalFee"
        >
        </list-item>
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中..."></loading>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { getCouponByOpenId } from '@/services/coupon'
import ListItem from './components/ListItem'
import { Tab, TabItem, Loading, TransferDomDirective as TransferDom } from 'vux'
import moment from 'moment'

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
    console.log('totalFee', totalFee)
    this.$vux.loading.show()
    this.openid = storage({key: 'openid'})
    try {
      const couponList = await getCouponByOpenId({openId: this.openid, type: 0})
      console.log('couponList', couponList)
      if (couponList.code === 200) {
        this.coupons = couponList.obj
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
      res = coupons.map((item) => {
        const {id, ...couponType} = item.couponType
        return {
          id: item.id,
          couponCode: item.couponCode,
          status: item.status,
          ...couponType,
          couponid: id,
          endtime: moment(couponType.expiryDate).unix() + '999'
        }
      })
      console.log('res', res)
      return res
    }
  },
  methods: {
    async onTabClick (index) {
      this.showLoading = true
      // type 1表示查询有效的优惠券 0表示查询失效优惠券
      console.log('12312312', index)
      const couponList = await getCouponByOpenId({openId: this.openid, type: index})
      console.log('couponList', couponList)
      if (couponList.code === 200) {
        this.coupons = couponList.obj
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
<style lang="less">
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.active-1 {
  color: rgb(55, 174, 252) !important;
  border-bottom: 3px solid rgb(55, 174, 252) !important;
}
.list {
  &-container {
    .none-coupon {
      padding: 2rem;
      img {
        width: 10rem;
        height: 10rem;
      }
      p {
        font-size: 1.6rem;
        color: #666;
      }
    }
  }
}
</style>
