<template>
  <div
    :class="{
      'listitem': true,
      'listitem--sended': status === 'SENDED',
      'listitem--used': status === 'USED',
      'listitem--expired': status === 'EXPIRED'
    }"
    @click.stop.prevent="goPath"
  >
    <div class="listitem-image">
      <img src="../../../assets/images/coupon_logo.png" alt="卡券图标">
    </div>
    <div class="listitem-intro">
      <p class="listitem-intro-name">{{name}}</p>
      <p class="listitem-intro-func">
        {{func}}
      </p>
    </div>
  </div>
</template>

<script>

// 代金券状态：SENDED-可用，USED-已实扣，EXPIRED-已过期

export default {
  name: 'listitem',
  props: {
    id: {
      type: Number,
      default: 1
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
    statusTxt () {
      return this.statusList[this.status] || ''
    }
  },
  created () {
  },
  methods: {
    goPath () {
      const id = this.id
      this.$router.push({path: '/coupon/detail', query: {id}})
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
    background: white url('../../../assets/images/coupon_used.png') no-repeat;
    background-size: 20% 80%;
    background-position: 94% 43%;
  }
  &--expired {
    background: white url('../../../assets/images/coupon_expired.png') no-repeat;
    background-size: 20% 80%;
    background-position: 94% 43%;
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
