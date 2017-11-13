<template>
  <div class="payresult">
    <div class="container">
      <div class="wrapper">
        <div class="payresult-content">
          <div class="result-info">
            <icon :type="status"></icon>
            <span class="pay-info">
              {{status === 'success' ? '支付成功 !' : '支付失败 !' }}
            </span>
          </div>
          <div class="payresult-content-item">
            <span>订单号:</span>
            <span>{{orderNo}}</span>
          </div>
          <div class="payresult-content-item">
            <span>订单总额:</span>
            <span>{{totalFee}}元</span>
          </div>
          <div class="payresult-content-btn">
            <router-link class="common check" :to="{path:'/orderdetail',query:{id:orderId}}">
              点击查看
            </router-link>
            <router-link to="/send" class="common back">
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'payresult',
  data () {
    return {
      status: '',
      orderId: '',
      orderNo: '',
      totalFee: ''
    }
  },
  created () {
    const {orderid, status, orderno, totalfee} = this.$route.query
    this.orderId = orderid
    this.status = status
    this.orderNo = orderno
    this.totalFee = totalfee
  },
  components: {
    Icon
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.payresult {
  .container {
    .purple-bg;
    min-height: 100vh;
  }
  .wrapper {
    padding: 6rem 2rem;
  }
  &-content {
    padding: 1rem;
    background: white;
    min-height: 10rem;
    border-radius: 6px;
    .result-info {
      .flex;
      padding: 1rem 0;
      justify-content: center;
      .pay-info {
        padding-left: 1rem;
        font-size: 2.5rem;
      }
    }
    &-item {
      .flex;
      justify-content: flex-start;
      span {
        padding: .4rem 1rem .4rem 0;
        font-size: 1.4rem;
      }
    }
    &-btn {
      .flex;
      justify-content: space-around;
      padding: 2rem 0;
      .common {
        font-size: 1.4rem;
        padding: .3rem 1rem;
        border-radius: 3px;
        outline: none;
      }
      .check {
        color: #fff;
        background: @m-yellow;
        border: 1px solid @m-yellow;
      }
      .back {
        color: @m-yellow;
        border: 1px solid @m-yellow;
        background: transparent;
      }
    }
  }
}
</style>
