<template>
  <div
    :class="{
      'listitem': true,
      'listitem--used': itemDis,
      'listitem--sended': realStatus === 'SENDED',
      'listitem--expired': realStatus === 'EXPIRED'
    }"
    @click.stop.prevent="goPath"
  >
    <div class="listitem-image">
      <img src="../../../assets/images/coupons.png" alt="卡券图标">
    </div>
    <div class="listitem-intro">
      <p class="listitem-intro-name">满{{data.couponThreshold}}减{{func}}</p>
      <p class="listitem-intro-func">
        有效期: {{startTime}} - {{endTime}}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// 代金券状态：SENDED-可用，USED-已实扣，EXPIRED-已过期
export default {
  name: 'listitem',
  props: {
    data: {
      type: Object
    },
    name: {
      type: String,
      default: '国际快递'
    },
    func: {
      type: Number,
      default: 0
    },
    endtime: {
      type: String,
      default: ''
    },
    totalFee: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      statusList: {
        SENDED: '可用',
        USED: '已实扣',
        EXPIRED: '已过期'
      }
    }
  },
  computed: {
    itemDis () {
      if (this.totalFee === '') {
        console.log(1)
        return true
      }
      if (new Date().getTime() < Number(moment(this.data.effectiveDate).unix() + '000')) {
        return false
      }
      if (this.totalFee > this.data.couponThreshold) {
        return false
      }
      return true
    },
    startTime () {
      return moment(this.data.effectiveDate).format('YYYY-MM-DD')
    },
    endTime () {
      return moment(this.data.expiryDate).format('YYYY-MM-DD')
    },
    realStatus () {
      // 判断优惠券是否失效
      let endtime = this.endtime
      endtime = Number(endtime)
      const isExpired = endtime >= new Date().getTime()
      return isExpired ? 'SENDED' : 'EXPIRED'
    },
    statusTxt () {
      return this.statusList[this.realStatus] || ''
    }
  },
  created () {
  },
  methods: {
    goPath () {
      if (this.realStatus === 'SENDED') {
        let query = this.data
        query.with_data = 1
        query.startTime = this.startTime
        query.endTime = this.endTime
        this.$router.push({path: '/coupon/detail', query})
      } else {
        this.$vux.toast.show({
          text: this.statusTxt,
          width: '16rem',
          type: 'warn'
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../../../assets/styles/helpers.less';

.listitem {
  .flex;
  padding: 1rem;
  margin: 1rem;
  background: white;
  border-radius: 6px;
  &--used {
    background: url('http://cms.mingz-tech.com/cdn/coupon_used.png');
    background-color: white;
    background-size: 20% 80%;
    background-position: 94% 43%;
    background-repeat: no-repeat;
  }
  &--expired {
    background: url('../../../assets/images/overdue.png');
    background-color: white;
    background-size: 13%;
    background-position: 94% 43%;
    background-repeat: no-repeat;
  }
  &-image {
    img {
      height: 2.8rem;
      width: auto;
    }
  }
  &-intro {
    padding-left: 1rem;
    p {
      text-align: left;
    }
    &-name {
      font-size: 1.6rem;
    }
    &-func {
      font-size: 1.2rem;
    }
  }
}
</style>
