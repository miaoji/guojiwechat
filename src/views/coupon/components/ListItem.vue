<template>
  <div
    :class="{
      'listitem': true,
      'listitem--used': itemDis && type === 'select',
      'listitem--sended': realStatus === 'SENDED',
      'listitem--expired': realStatus === 'EXPIRED',
      'lisritem--select': itemClick
    }"
    @click.stop.prevent="goPath(data, itemDis)"
  >
    <div class="listitem-image">
      <img src="../../../assets/images/coupons.png" alt="卡券图标">
    </div>
    <div class="listitem-intro">
      <p class="listitem-intro-name">满{{data.couponThreshold}}减{{func}} </p>
      <p class="listitem-intro-func">
        有效期: {{startTime}} - {{endTime}}
      </p>
      <p><span class='listitem-intro-name-span'>{{data.superposition?'可叠加使用':'仅限单个使用'}}</span></p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'

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
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 代金券状态：SENDED-可用，USED-未达标，EXPIRED-已过期
      statusList: {
        SENDED: '可用',
        USED: '未达标',
        EXPIRED: '已过期'
      }
    }
  },
  computed: {
    ...mapGetters({
      couponList: 'getCouponList'
    }),
    itemDis () {
      if (this.totalFee === '') {
        return true
      }
      if (new Date().getTime() < Number(this.data.effectiveDate)) {
        return false
      }
      if (this.totalFee > this.data.couponThreshold) {
        return false
      }
      return true
    },
    startTime () {
      return moment(Number(this.data.effectiveDate)).format('YYYY.MM.DD')
    },
    endTime () {
      return moment(Number(this.data.expiryDate)).format('YYYY.MM.DD')
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
    },
    itemClick () {
      if (this.couponList[this.data.id]) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_COUPON_LIST'
    ]),
    goPath (item, itemDis) {
      if (itemDis) {
        return false
      }
      // 如果当前页面的类型type是select则此组件将不进行页面的额跳转,作为可选择的组件
      if (this.type === 'select') {
        if (!this.itemClick) {
          // this.itemClick === true 表示已经被选中, === false 表示未被选中
          // 如果选择则将本条信息添加到vuex中
          const objKeys = Object.keys(this.couponList)
          // 选择的规则, 可叠加的优惠券可进行多选,不可叠加的优惠券只能单选
          // 不能两种优惠一起选择
          if (objKeys.length !== 0) {
            if (this.couponList[objKeys[0]].superposition === 0) {
              return false
            }
            if (this.couponList[objKeys[0]].superposition !== item.superposition) {
              return false
            }
          }
          this.SET_COUPON_LIST({
            couponList: {
              ...this.couponList,
              [item.id]: item
            }
          })
        } else {
          // 如果取消了选择则将本条信息从vuex中去除
          delete this.couponList[item.id]
          this.SET_COUPON_LIST({
            couponList: {
              ...this.couponList
            }
          })
        }
        return false
      }
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
.lisritem--select {
  background: url('../../../assets/images/select.png')!important;
  background-color: white!important;
  background-size: 8%!important;
  background-position: 94% 43%!important;
  background-repeat: no-repeat!important;
}
.listitem {
  .flex;
  padding: 1rem;
  margin: 1rem;
  background: white;
  border: 1px solid #fff;
  border-radius: 4px;
  &--used {
    // display: none;
    background: url('../../../assets/images/unsatisfied.png');
    background-color: white;
    background-size: 13%;
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
      &-span {
        font-size: 1.2rem;
        color: #ffa414;
      }
    }
    &-func {
      font-size: 1.2rem;
    }
  }
}
</style>
