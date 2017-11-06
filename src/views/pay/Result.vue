<template>
  <div class="payresult">
    <div class="container">
      <h1>支付结果</h1>
      <div>
        订单号： 155411
      </div>
      <div>
        支付结果：成功
      </div>
    </div>
  </div>
</template>

<script>
// import { storage } from '@/utils'
// import request from '@/utils/request'

export default {
  name: 'payresult',
  mounted () {
    window.document.title = '支付结果'
  },
  data () {
    return {
    }
  },
  created () {
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
@import '~vux/src/styles/close';

.payresult {
  .container {
    min-height: 100vh;
    background: white;
  }
}
</style>
