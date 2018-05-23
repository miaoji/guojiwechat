<template>
  <div class="list">
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
        >
        </list-item>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { getCouponByOpenId } from '@/services/coupon'
import ListItem from './components/ListItem'
import moment from 'moment'

export default {
  name: 'list',
  data () {
    return {
      coupons: []
    }
  },
  async created () {
    this.$vux.loading.show()
    const openid = storage({key: 'openid'})
    try {
      const couponList = await getCouponByOpenId({openId: openid})
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
  components: {
    ListItem
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
