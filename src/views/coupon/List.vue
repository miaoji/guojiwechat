<template>
  <div class="list">
    <div class="list-container">
      <div class="none-coupon" v-show="couponsResultMap.length === 0">
        <img src="../../assets/images/coupon_none.png" alt="">
        <p>暂时无可用的优惠券</p>
      </div>
      <div v-for="item in couponsResultMap">
        <list-item
          :name="item.coupon_name"
          :data="item"
          :func="item.coupon_value"
          :status="item.coupon_state"
          :endtime="item.end_time"
        >
        </list-item>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { query } from '@/services/coupon'
import ListItem from './components/ListItem'

export default {
  name: 'list',
  mounted () {
    window.document.title = '卡券列表'
  },
  data () {
    return {
      coupons: []
    }
  },
  async created () {
    this.$vux.loading.show()
    const openid = storage({key: 'openid'})
    try {
      const couponRes = await query({
        openid
      })
      if (couponRes.code === 200) {
        this.coupons = couponRes.obj
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
      for (let i = 0, len = coupons.length; i < len; i++) {
        res.push(coupons[i]['resultMap'])
      }
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
