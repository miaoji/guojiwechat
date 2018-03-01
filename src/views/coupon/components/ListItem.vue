<template>
  <div
    :class="{
      'listitem': true,
      'listitem--sended': realStatus === 'SENDED',
      'listitem--used': realStatus === 'USED',
      'listitem--expired': realStatus === 'EXPIRED'
    }"
    @click.stop.prevent="goPath"
  >
    <div class="listitem-image">
      <img src="../../../assets/images/coupon_logo.jpg" alt="卡券图标">
    </div>
    <div class="listitem-intro">
      <p class="listitem-intro-name">{{name}}</p>
      <p class="listitem-intro-func">
        {{func/100}}{{$t('coupon.detail.money')}}
      </p>
    </div>
  </div>
</template>

<script>
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
      type: String,
      default: '代金券'
    },
    status: {
      type: String,
      default: ''
    },
    endtime: {
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
    realStatus () {
      let endtime = this.endtime + '000'
      endtime = Number(endtime)
      const isExpired = endtime >= new Date().getTime()
      return isExpired ? this.status : 'EXPIRED'
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
  &--sended {
  }
  &--used {
    background: url('http://oxou6bzgv.bkt.clouddn.com/coupon_used.png');
    background-color: white;
    background-size: 20% 80%;
    background-position: 94% 43%;
    background-repeat: no-repeat;
  }
  &--expired {
    background: url('http://oxou6bzgv.bkt.clouddn.com/coupon_expired.png');
    background-color: white;
    background-size: 20% 80%;
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
      font-size: 1.4rem;
    }
    &-func {
      font-size: 1.8rem;
    }
  }
}
</style>
